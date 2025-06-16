import { useRouteError } from "react-router-dom";

import LinkButton from "./LinkButton";

function Error() {
  // We can actually get the error message that happens inside React Router by using another custom hook.
  // So, since we are using this Error component as the "errorElement" in App component, this component
  // gets access to the error that has occurred.
  const error = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{error.data || error.message}</p>
      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default Error;
