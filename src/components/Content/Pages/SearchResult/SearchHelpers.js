import Order from '../OrderBoard/Order';
import { sendGet } from "../../../../model/helpers/network/Network";

/**
 * Helper functions for the search order functionality.
 */
export default class SearchHelpers {
    constructor(handleClick) {
        this.handleClick = handleClick;
    }

    /**
     * Converts order states from numbers to strings.
     *
     * @param {Number} state The state in number form.
     * @returns The state in string form.
     */
    getOrderState(state) {
        if (state == 0) {
          return "pending";
        } else if (state == 1){ 
          return  "approved";
        } else if (state == 2) {
          return  "started";
        }
    }

    /**
     * Gets all orders.
     */
    async getOrders() {
        var orders = await (
            await sendGet("http://127.0.0.1:5000/orders")
        ).json();
        return orders;
    }
    
    /**
     * Creates order components for all the orders in the database.
     * TODO: Will only create components for the orders that match the search result.
     */
    async getAllResultComponents() {
        var ordersData = await this.getOrders();
        let allSearchResults = [];
        var data = await ordersData;
        for (let i = 0; i < data.length; i++) {
            var orderDetails = [data[i].project, data[i].engines.length];
            allSearchResults.push(
                <Order
                    id={data[i].id}
                    orderDetails={orderDetails}
                    state={data[i].state}
                    clicked={() => this.handleClick(data[i].id, data[i].state)}
                />
            );
        }
        return allSearchResults;
    }
    
    /**
     * Gets the three first search results for the popper window.
     * @returns Array with the three first search results.
     */
    async getPopperResultComponents() {
        var allSearchResults = await this.getAllResultComponents();
        var popperResults = [];
        for (let i = 0; i < 3; i++) {
            popperResults.push(allSearchResults[i]);
        }
        return popperResults;
    }
}
