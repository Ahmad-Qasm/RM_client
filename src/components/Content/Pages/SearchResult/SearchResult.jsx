import { useState, useEffect } from 'react';
import SearchHelpers from './SearchHelpers';
import OrderInfo from '../OrderBoard/OrderInfo';
import { stopLoader } from '../../../../model/helpers/LoadingIndicator';

/**
 * The component for the search result page.
 */
export default function SearchResult() {
  const [allSearchResult, setAllSearchResult] = useState([]);
  const [orderId, setOrderId] = useState();
  const [orderState, setOrderState] = useState();
  const [openOrderInfo, setOpenOrderInfo] = useState(false);

  const searchHelpers = new SearchHelpers(handleClick);

  /**
   * Gets the clicked order's details and display the orderInfo dialog. 
   *
   * @param {Number} id The clicked order's id.
   * @param {Number} state The clicked order's state.
   */
  function handleClick(id, state) {
    setOrderId(id);
    setOrderState(searchHelpers.getOrderState(state));
    setOpenOrderInfo(true);
  }

  /**
   * Refreshes search result components.
   */
  useEffect(async () => {
    stopLoader();
    var orders = await searchHelpers.getAllResultComponents();
    setAllSearchResult(orders);
  }, [searchHelpers.orderState, searchHelpers.openOrderInfo]);

  return <>
    {allSearchResult}
    <OrderInfo orderId={orderId} orderState={orderState} orderOpenInSearchMode={openOrderInfo}
    setOpenOrderInfo={setOpenOrderInfo} closeOrderInfo={() => setOpenOrderInfo(false)}/>
  </>
}