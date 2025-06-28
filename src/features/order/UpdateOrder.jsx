import { useFetcher } from "react-router-dom";

import { updateOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

function UpdateOrder() {
  const fetcher = useFetcher();

  return (
    // Now, in order to update, to write data, we do not use fetcher.load but instead we use a Form component
    // that the fetcher provides to us. This is just like the other Form component that we used in CreateOrder
    // with the only difference that submitting the Form creates a new navigation, while fetcher.Form will not
    // navigate away. It will simply submit the form and then re-validate the page.
    // Side note: We have two ways of updating data: There is the PUT request where we need to pass in the entire
    // new updated object, and then there is PATCH which will only take in the data that has actually changed and
    // add that to the original object on the server.
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

export default UpdateOrder;
