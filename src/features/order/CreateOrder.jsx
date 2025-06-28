import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import store from "../../store";
import { createOrder } from "../../services/apiRestaurant";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import { fetchAddress } from "../user/userSlice";
import EmptyCart from "../cart/EmptyCart";
import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

function CreateOrder() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const formErrors = useActionData();
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const [withPriority, setWithPriority] = useState(false);

  const isLoadingAddress = addressStatus === "loading";
  const isSubmitting = navigation.state === "submitting";
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  function handleGetPosition(e) {
    e.preventDefault();
    dispatch(fetchAddress());
  }

  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

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
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="customer">
            First Name
          </label>
          <input
            className="input grow"
            type="text"
            id="customer"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="phone">
            Phone number
          </label>
          <div className="grow">
            <input
              className="input w-full"
              type="tel"
              id="phone"
              name="phone"
              required
            />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40" htmlFor="address">
            Address
          </label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              id="address"
              name="address"
              defaultValue={address}
              disabled={isLoadingAddress}
              required
            />
            {addressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[35px] z-50 sm:top-[3px] md:top-[5px]">
              <Button
                type="small"
                onClick={handleGetPosition}
                disabled={isLoadingAddress}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />

          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting
              ? "Placing order..."
              : `Order now from ${formatCurrency(totalPrice)}`}
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
    priority: data.priority === "true",
  };

  // Error handling
  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone =
      "Please give us your correct phone number. We might need it to contact you.";

  if (Object.keys(errors).length > 0) return errors;

  // If everything is correct, call the API to get the newly created order and redirect
  const newOrder = await createOrder(order);

  // This is kind of a hack approach but this is what we have to do in order to make it work since here
  // we cannot use useDispatch. It is important, though, to not overuse this technique because it deactives
  // a couple of performance optimizations on Redux on this page.
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
