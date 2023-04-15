import { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql
} from "@apollo/client";

const HASURA_SECRET =
  "WRwsjA9dgCSOEoULSv7bkIlt1Kxc6jTlWNbYaAjlk6rhcDhjyKBcUdFYFQE6oae5";
const API_URI = "https://kdansari.hasura.app/v1/graphql";

const client = new ApolloClient({
  uri: API_URI,
  headers: {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": HASURA_SECRET
  },
  cache: new InMemoryCache()
});

const PostApi = () => {
  const [data, setData] = useState({
    title: ""
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    await client.mutate({
      mutation: gql`
        mutation {
          insert_todos_one(object: {title: "${data.title}"}){
            id
          }
        }
      `
    });
    setLoading(false);
    window.location.reload();
  };
  if (loading) return "Submitting...";
  return (
    <div>
      <input
        name="title"
        value={data.title}
        type="text"
        placeholder="text"
        onChange={(e) =>
          setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        }
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <PostApi />
  </ApolloProvider>
);
