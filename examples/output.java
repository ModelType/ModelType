//#GeneratedOn:2017-09-12T03:28:24.870Z
//#ETAG:69b13ea3f38d9206a74330b5f31e79c0
// This is the head for the java file
package com.modeltype.Test;

    import org.bson.types.ObjectId;
    import org.bson.Document;
    import java.util.Date;
    import com.mongodb.BasicDBObject;
    public class Models {
    private static Models Models_Singleton;
    abstract class ModelType_JavaClass { 
        protected Document doc;
        protected BasicDBObject update;
        protected void keyUpdated(String key, Object val) { 
            this.update.append(key, val); 
        }
        public ModelType_JavaClass(Document doc) {
            this.doc = doc;
            this.update = new BasicDBObject();
        }
     }
     abstract class SubDoc {
        protected ModelType_JavaClass parentDoc;
        protected SubDoc parentSubDoc;
        protected Document doc;
        protected String name;
        public SubDoc(ModelType_JavaClass parent, String name, Document doc) {
            this.doc = doc;
            this.parentDoc = parent;
            this.name = name;
        }
        public SubDoc(SubDoc parent, String name, Document doc) {
            this.doc = doc;
            this.parentSubDoc = parent;
            this.name = name;
        }
        protected void keyUpdated(String key, Object val) {
            if(this.parentDoc != null) {
                this.parentDoc.keyUpdated(name + "." + key, val);
            }
            if(this.parentSubDoc != null) {
                this.parentSubDoc.keyUpdated(name +"."+key, val);
            }
        }
        
     }public class User extends ModelType_JavaClass {
        public User(Document mongodbDocument) { 
            super(mongodbDocument);
        }
        public BasicDBObject update() {
            return new BasicDBObject().append("$set", this.update);
        }
        
                public SubDoc_Name getName() { 
                    if(this.Instance_SubDoc_Name == null) {
                        this.Instance_SubDoc_Name = new SubDoc_Name(this, "Name", (Document) this.doc.get("Name")); 
                    } 
                    return this.Instance_SubDoc_Name;
                }
            
                public void setName(SubDoc_Name obj) { }
            
                public class SubDoc_Name extends SubDoc{ 
                    SubDoc_Name(ModelType_JavaClass parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                    SubDoc_Name(SubDoc parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                   public String getFirst() { return (String) this.doc.get("First"); }
                    public void setFirst(String obj) { 
                        this.doc.put("First", (Object) obj);
                        this.keyUpdated("First", (Object) obj);
                    }
                    public String getLast() { return (String) this.doc.get("Last"); }
                    public void setLast(String obj) { 
                        this.doc.put("Last", (Object) obj);
                        this.keyUpdated("Last", (Object) obj);
                    }
                    
                }
                protected SubDoc_Name Instance_SubDoc_Name;
            public Date getCreated() { return (Date) this.doc.get("Created"); }
                    public void setCreated(Date obj) { 
                        this.doc.put("Created", (Object) obj);
                        this.keyUpdated("Created", (Object) obj);
                    }
                    public Date getLastLogin() { return (Date) this.doc.get("LastLogin"); }
                    public void setLastLogin(Date obj) { 
                        this.doc.put("LastLogin", (Object) obj);
                        this.keyUpdated("LastLogin", (Object) obj);
                    }
                    public String getEmail() { return (String) this.doc.get("Email"); }
                    public void setEmail(String obj) { 
                        this.doc.put("Email", (Object) obj);
                        this.keyUpdated("Email", (Object) obj);
                    }
                    public String getPassword() { return (String) this.doc.get("Password"); }
                    public void setPassword(String obj) { 
                        this.doc.put("Password", (Object) obj);
                        this.keyUpdated("Password", (Object) obj);
                    }
                    
                public SubDoc_FavoriteStore getFavoriteStore() { 
                    if(this.Instance_SubDoc_FavoriteStore == null) {
                        this.Instance_SubDoc_FavoriteStore = new SubDoc_FavoriteStore(this, "FavoriteStore", (Document) this.doc.get("FavoriteStore")); 
                    } 
                    return this.Instance_SubDoc_FavoriteStore;
                }
            
                public void setFavoriteStore(SubDoc_FavoriteStore obj) { }
            
                public class SubDoc_FavoriteStore extends SubDoc{ 
                    SubDoc_FavoriteStore(ModelType_JavaClass parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                    SubDoc_FavoriteStore(SubDoc parent, String name, Document doc) {
                        super(parent, name, doc);
                    }
                   
                }
                protected SubDoc_FavoriteStore Instance_SubDoc_FavoriteStore;
            
        }
        public static User castUser(Document doc) {
            if(Models_Singleton == null) Models_Singleton = new Models();
            return Models_Singleton.new User(doc);
        }
        
public class Store extends ModelType_JavaClass {
        public Store(Document mongodbDocument) { 
            super(mongodbDocument);
        }
        public BasicDBObject update() {
            return new BasicDBObject().append("$set", this.update);
        }
        public String getName() { return (String) this.doc.get("Name"); }
                    public void setName(String obj) { 
                        this.doc.put("Name", (Object) obj);
                        this.keyUpdated("Name", (Object) obj);
                    }
                    public String getAddress() { return (String) this.doc.get("Address"); }
                    public void setAddress(String obj) { 
                        this.doc.put("Address", (Object) obj);
                        this.keyUpdated("Address", (Object) obj);
                    }
                    
                public Document[] getUsers() { return (Document[]) this.doc.get("Users"); }
            
        }
        public static Store castStore(Document doc) {
            if(Models_Singleton == null) Models_Singleton = new Models();
            return Models_Singleton.new Store(doc);
        }
        
}