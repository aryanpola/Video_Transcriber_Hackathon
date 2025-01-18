from astrapy import DataAPIClient

# Initialize the client
client = DataAPIClient("AstraCS:tacXoGlIFoRrGZleWZBAuCkH:e4c3fdc4db013270504e7155c2aa4b9c213d0168abfdac6b74a3f9b9281fdd4c")
db = client.get_database_by_api_endpoint(
  "https://f7e7fd32-8caa-435f-9ad5-023311d1941f-us-east-2.apps.astra.datastax.com"
)

print(f"Connected to Astra DB: {db.list_collection_names()}")