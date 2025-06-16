import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";

import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  return (
    <div>
      <h2>Ready to order? Let's go!</h2>

      {/*
        WRITE DATA WITH REACT ROUTER "ACTIONS"
        1) Use the Form component.
        According to the teacher: Here we can also use PATCH and DELETE, but not GET. So, the GET method wouldn't work
        in the way that we'll see throughout this lecture, but POST, PATCH, and DELETE are going to work.
        Then, we could also specified the "action" where we can then write the path that this form shoudl be submitted to.
        But, this is not going to be necessary because by default React Router will simply match the closest route.
        So, there is no need to write action="/order/new".
      */}
      <Form method="POST">
        <div>
          <label htmlFor="customer">First Name</label>
          <input
            className="input"
            type="text"
            id="customer"
            name="customer"
            required
          />
        </div>

        <div>
          <label htmlFor="phone">Phone number</label>
          <div>
            <input
              className="input"
              type="tel"
              id="phone"
              name="phone"
              required
            />
          </div>
          {formErrors?.phone && <p>{formErrors.phone}</p>}
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <div>
            <input
              className="input"
              type="text"
              id="address"
              name="address"
              required
            />
          </div>
        </div>

        <div>
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Placing order..." : "Order now"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

// WRITE DATA WITH REACT ROUTER "ACTIONS"
// 2) We create the action
// As soon as we submit the special "Form", then it will create a request that it will basically be intercepted by
// this "action" function as soon as we have it connected with React Router, that is, we the route defined in App component.
export async function action({ request }) {
  // formData is just actually a regular Web API, that is, it is provided by the browser
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Prepare the order object
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };

  // Error handling
  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // If everything is correct, call the API to get the newly created order and redirect
  const newOrder = await createOrder(order);

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
