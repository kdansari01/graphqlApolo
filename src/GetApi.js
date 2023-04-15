import { useState, useEffect } from "react";
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

const GetApi = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    client
      .query({
        query: gql`
          query {
            todos {
              id
              created_at
              title
            }
          }
        `
      })
      .then((result) => setTodos(result.data.todos));
    setLoading(false);
  }, []);
  if (loading) return "loading...";
  const handleDeleteTodo = async (id) => {
    setLoading(true);
    await client.mutate({
      mutation: gql`
        mutation {
          delete_todos_by_pk(id: ${id}) {
            created_at
            id
            title
          }
        }
      `
    });
    setTodos(todos.filter((todo) => todo.id !== id));
    setLoading(false);
  };
  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <div>
            {todo.id}:- {todo.title}
            <button onClick={() => handleDeleteTodo(todo.id)}>X</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <GetApi />
  </ApolloProvider>
);
