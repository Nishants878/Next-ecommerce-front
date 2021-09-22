import gql from 'graphql-tag';
import React from 'react';
import { useQuery } from '@apollo/client';
import Head from 'next//head';
import styled from 'styled-components';
import Link from 'next/link';
import DisplayError from '../components/ErrorMessage';
import OrderItemsStyles from '../components/styles/OrderItemStyles';
import formatMoney from '../lib/formatMoney';

const USERS_ORDERS_QUERY = gql`
  query USERS_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUI = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const countItemsInAnOrder = (order) =>
  order.items.reduce((tally, item) => tally + item.quantity, 0);

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USERS_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Yours Orders({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUI>
        {allOrders.map((order) => (
          <OrderItemsStyles>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className="order-meta">
                  {/* <p>{countItemsInAnOrder(order)} Items</p> */}
                  <p>{order.items.length} Products</p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={item.id}
                      src={item?.photo?.image?.publicUrlTransformed}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemsStyles>
        ))}
      </OrderUI>
    </div>
  );
}
