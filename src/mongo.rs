use mongodb::Client as MongoClient;

const URL: &str = "mongodb://skl:1234@localhost:27617/skl";

pub async fn init() -> MongoClient {
    match MongoClient::with_uri_str(URL).await {
        Ok(mongo_client) => mongo_client,
        Err(error) => panic!(error)
    }
}
