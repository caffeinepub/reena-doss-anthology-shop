import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Blog and Shop Types
  type BlogCategory = {
    #poems;
    #quotes;
    #photographs;
    #art;
    #lyrics;
    #essays;
    #prose;
    #letters;
  };

  type FulfillmentType = {
    #external_pod;
    #digital_download;
  };

  type ShopCategory = {
    #words;
    #art;
    #creativity;
  };

  type BlogPost = {
    id : Nat;
    title : Text;
    category : BlogCategory;
    body : Text;
    imageUrl : ?Storage.ExternalBlob;
    publishedAt : Time.Time;
    authorNote : ?Text;
  };

  type PublicationType = {
    #anthologies;
    #solo;
    #collaboration;
  };

  type Publication = {
    id : Nat;
    title : Text;
    publicationType : PublicationType;
    description : Text;
    coverImage : ?Storage.ExternalBlob;
    externalUrl : Text;
    year : Text;
  };

  type Feature = {
    id : Nat;
    name : Text;
    description : Text;
    imageUrl : ?Storage.ExternalBlob;
    externalUrl : Text;
  };

  type CauseCategory = {
    #earth;
    #humanity;
    #mental_health;
  };

  type Cause = {
    id : Nat;
    name : Text;
    causeCategory : CauseCategory;
    description : Text;
    imageUrl : ?Storage.ExternalBlob;
    externalUrl : Text;
  };

  type VoicePost = {
    id : Nat;
    title : Text;
    body : Text;
    parentId : ?Nat;
    createdAt : Time.Time;
  };

  type Product = {
    id : Nat;
    title : Text;
    shopCategory : ShopCategory;
    description : Text;
    imageUrl : Storage.ExternalBlob;
    price : Text;
    externalUrl : Text;
    fulfillmentType : FulfillmentType;
    createdAt : Time.Time;
  };

  module BlogPost {
    public func compare(p1 : BlogPost, p2 : BlogPost) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Publication {
    public func compare(p1 : Publication, p2 : Publication) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Feature {
    public func compare(f1 : Feature, f2 : Feature) : Order.Order {
      Nat.compare(f1.id, f2.id);
    };
  };

  module Cause {
    public func compare(c1 : Cause, c2 : Cause) : Order.Order {
      Nat.compare(c1.id, c2.id);
    };
  };

  module VoicePost {
    public func compare(v1 : VoicePost, v2 : VoicePost) : Order.Order {
      Nat.compare(v1.id, v2.id);
    };
  };

  var blogPostId = 0;
  var productId = 0;
  var publicationId = 0;
  var featureId = 0;
  var causeId = 0;
  var voicePostId = 0;

  let blogPosts = Map.empty<Nat, BlogPost>();
  let products = Map.empty<Nat, Product>();
  let publications = Map.empty<Nat, Publication>();
  let features = Map.empty<Nat, Feature>();
  let causes = Map.empty<Nat, Cause>();
  let voicePosts = Map.empty<Nat, VoicePost>();

  // Blog Post Functions
  public shared ({ caller }) func createBlogPost(title : Text, category : BlogCategory, body : Text, imageUrl : ?Storage.ExternalBlob, authorNote : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let id = blogPostId;
    let post : BlogPost = {
      id;
      title;
      category;
      body;
      imageUrl;
      publishedAt = Time.now();
      authorNote;
    };
    blogPosts.add(id, post);
    blogPostId += 1;
    id;
  };

  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  public query ({ caller }) func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort();
  };

  public query ({ caller }) func getBlogPostsByCategory(category : BlogCategory) : async [BlogPost] {
    blogPosts.values().toArray().filter(func(post : BlogPost) : Bool { post.category == category });
  };

  public shared ({ caller }) func updateBlogPost(id : Nat, title : Text, category : BlogCategory, body : Text, imageUrl : ?Storage.ExternalBlob, authorNote : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    switch (blogPosts.get(id)) {
      case (null) {
        Runtime.trap("Blog post not found");
      };
      case (?_) {
        let updatedPost : BlogPost = {
          id;
          title;
          category;
          body;
          imageUrl;
          publishedAt = Time.now();
          authorNote;
        };
        blogPosts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(id);
  };

  public shared ({ caller }) func createProduct(title : Text, shopCategory : ShopCategory, description : Text, imageUrl : Storage.ExternalBlob, price : Text, externalUrl : Text, fulfillmentType : FulfillmentType) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let id = productId;
    let product : Product = {
      id;
      title;
      shopCategory;
      description;
      imageUrl;
      price;
      externalUrl;
      fulfillmentType;
      createdAt = Time.now();
    };
    products.add(id, product);
    productId += 1;
    id;
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func getProductsByCategory(category : ShopCategory) : async [Product] {
    products.values().toArray().filter(func(product : Product) : Bool { product.shopCategory == category });
  };

  public shared ({ caller }) func updateProduct(id : Nat, title : Text, shopCategory : ShopCategory, description : Text, imageUrl : Storage.ExternalBlob, price : Text, externalUrl : Text, fulfillmentType : FulfillmentType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) {
        Runtime.trap("Product not found");
      };
      case (?_) {
        let updatedProduct : Product = {
          id;
          title;
          shopCategory;
          description;
          imageUrl;
          price;
          externalUrl;
          fulfillmentType;
          createdAt = Time.now();
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    products.remove(id);
  };

  // Publications CRUD
  public shared ({ caller }) func createPublication(title : Text, publicationType : PublicationType, description : Text, coverImage : ?Storage.ExternalBlob, externalUrl : Text, year : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create publications");
    };
    let id = publicationId;
    let publication : Publication = {
      id;
      title;
      publicationType;
      description;
      coverImage;
      externalUrl;
      year;
    };
    publications.add(id, publication);
    publicationId += 1;
    id;
  };

  public shared ({ caller }) func updatePublication(id : Nat, title : Text, publicationType : PublicationType, description : Text, coverImage : ?Storage.ExternalBlob, externalUrl : Text, year : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update publications");
    };
    switch (publications.get(id)) {
      case (null) {
        Runtime.trap("Publication not found");
      };
      case (?_) {
        let updatedPublication : Publication = {
          id;
          title;
          publicationType;
          description;
          coverImage;
          externalUrl;
          year;
        };
        publications.add(id, updatedPublication);
      };
    };
  };

  public shared ({ caller }) func deletePublication(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete publications");
    };
    publications.remove(id);
  };

  public query ({ caller }) func getPublication(id : Nat) : async ?Publication {
    publications.get(id);
  };

  public query ({ caller }) func getAllPublications() : async [Publication] {
    publications.values().toArray().sort();
  };

  public query ({ caller }) func getPublicationsByType(publicationType : PublicationType) : async [Publication] {
    publications.values().toArray().filter(func(p : Publication) : Bool { p.publicationType == publicationType });
  };

  // Features CRUD
  public shared ({ caller }) func createFeature(name : Text, description : Text, imageUrl : ?Storage.ExternalBlob, externalUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create features");
    };
    let id = featureId;
    let feature : Feature = {
      id;
      name;
      description;
      imageUrl;
      externalUrl;
    };
    features.add(id, feature);
    featureId += 1;
    id;
  };

  public shared ({ caller }) func updateFeature(id : Nat, name : Text, description : Text, imageUrl : ?Storage.ExternalBlob, externalUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update features");
    };
    switch (features.get(id)) {
      case (null) {
        Runtime.trap("Feature not found");
      };
      case (?_) {
        let updatedFeature : Feature = {
          id;
          name;
          description;
          imageUrl;
          externalUrl;
        };
        features.add(id, updatedFeature);
      };
    };
  };

  public shared ({ caller }) func deleteFeature(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete features");
    };
    features.remove(id);
  };

  public query ({ caller }) func getFeature(id : Nat) : async ?Feature {
    features.get(id);
  };

  public query ({ caller }) func getAllFeatures() : async [Feature] {
    features.values().toArray().sort();
  };

  // Causes CRUD
  public shared ({ caller }) func createCause(name : Text, causeCategory : CauseCategory, description : Text, imageUrl : ?Storage.ExternalBlob, externalUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create causes");
    };
    let id = causeId;
    let cause : Cause = {
      id;
      name;
      causeCategory;
      description;
      imageUrl;
      externalUrl;
    };
    causes.add(id, cause);
    causeId += 1;
    id;
  };

  public shared ({ caller }) func updateCause(id : Nat, name : Text, causeCategory : CauseCategory, description : Text, imageUrl : ?Storage.ExternalBlob, externalUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update causes");
    };
    switch (causes.get(id)) {
      case (null) {
        Runtime.trap("Cause not found");
      };
      case (?_) {
        let updatedCause : Cause = {
          id;
          name;
          causeCategory;
          description;
          imageUrl;
          externalUrl;
        };
        causes.add(id, updatedCause);
      };
    };
  };

  public shared ({ caller }) func deleteCause(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete causes");
    };
    causes.remove(id);
  };

  public query ({ caller }) func getCause(id : Nat) : async ?Cause {
    causes.get(id);
  };

  public query ({ caller }) func getAllCauses() : async [Cause] {
    causes.values().toArray().sort();
  };

  public query ({ caller }) func getCausesByCategory(category : CauseCategory) : async [Cause] {
    causes.values().toArray().filter(func(c : Cause) : Bool { c.causeCategory == category });
  };

  // VoicePost CRUD
  public shared ({ caller }) func createVoicePost(title : Text, body : Text, parentId : ?Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create voice posts");
    };
    let id = voicePostId;
    let post : VoicePost = {
      id;
      title;
      body;
      parentId;
      createdAt = Time.now();
    };
    voicePosts.add(id, post);
    voicePostId += 1;
    id;
  };

  public shared ({ caller }) func updateVoicePost(id : Nat, title : Text, body : Text, parentId : ?Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update voice posts");
    };
    switch (voicePosts.get(id)) {
      case (null) {
        Runtime.trap("Voice post not found");
      };
      case (?_) {
        let updatedPost : VoicePost = {
          id;
          title;
          body;
          parentId;
          createdAt = Time.now();
        };
        voicePosts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteVoicePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete voice posts");
    };
    voicePosts.remove(id);
  };

  public query ({ caller }) func getVoicePost(id : Nat) : async ?VoicePost {
    voicePosts.get(id);
  };

  public query ({ caller }) func getAllVoicePosts() : async [VoicePost] {
    voicePosts.values().toArray().sort();
  };

  public query ({ caller }) func getRootVoicePosts() : async [VoicePost] {
    voicePosts.values().toArray().filter(func(post : VoicePost) : Bool { post.parentId == null });
  };

  public query ({ caller }) func getChildVoicePosts(parentId : Nat) : async [VoicePost] {
    voicePosts.values().toArray().filter(func(post : VoicePost) : Bool { switch (post.parentId) {
      case (null) { false };
      case (?p) { p == parentId };
    } });
  };
};
