/* eslint-disable no-plusplus */
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo  we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;
      // read the number of items from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if
      // there are items
      // and there arent  enough items to satisfy how many were requested then we are last page
      // then send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we dont have any items, we must go to the network to fetch them

        return false;
      }

      // if there are items, jusst return them from the cache, and we dont need to go the network
      if (items.length) {
        console.log(
          `There are ${items.length} items in cache! Gonna send them to apollo`
        );
      }

      return false; // fallback to network
      // first thing it does it asks the reader function for those items.
      // we can eitheer do one of those things
      // first things we can do is return the item as they are already in cache
      // The other thing we can fo is to return false (ntwork request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when apollo client comes back from the network with our product

      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      // finally we return merged items from cache
      return merged;
    },
  };
}
