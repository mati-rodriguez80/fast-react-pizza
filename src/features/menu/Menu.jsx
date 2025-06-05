import { useLoaderData } from "react-router-dom";

import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  // FETCHING DATA WITH REACT ROUTER "LOADERS"
  // 3) We provide the data to the page
  // Here we get the data into the component using the custom hook, and React Router will automatically know that
  // the data that we want here is the one that is associated to this page (menuLoader).
  // Effectively, what we just did here was to use a "Render As You Fetch Strategy", that is, React Router will start
  // fetching the data at the same time as it starts rendering the correct route. So, this things really happen at
  // the same time while what we did before in other projects using useEffect was always a "Fetch On Render Approach",
  // so basically we rendered the component first, and then it is when we start to fetch the data. And that will then
  // create so called Data Loading Waterfalls. But not here. Here everything really happens at the same time.
  const menu = useLoaderData();

  return (
    <>
      <h1>Menu</h1>
      <ul>
        {menu.map((pizza) => (
          <MenuItem pizza={pizza} key={pizza.id} />
        ))}
      </ul>
    </>
  );
}

// FETCHING DATA WITH REACT ROUTER "LOADERS"
// 1) We create the loader
// This data loader can be placed anywhere in our codebase, but the convention since to be to place the loader
// for the data of a certain page inside the file of that page. Also, the convention is to call the function "loader".
// We need this function to fetch whatever data it wants to provide to the page and then return it.
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
