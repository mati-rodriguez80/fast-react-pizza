import { useNavigate, useRouteError } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  // We can actually get the error message that happens inside React Router by using another custom hook.
  // So, since we are using this Error component as the "errorElement" in App component, this component
  // gets access to the error that has occurred.
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <button onClick={() => navigate(-1)}>&larr; Go back</button>
    </div>
  );
}

export default Error;
