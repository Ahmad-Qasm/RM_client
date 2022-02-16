import { Card, CardContent, Typography, CardActionArea } from "@material-ui/core";
import { useState, useEffect } from "react";

/**
 * Detail list item displayed with its info.
 *
 * @param {*} props { name, openAndSetClickedListItem, componentInfo, id, editMode }
 * name - name of the item.
 * openAndSetClickedListItem - Function that opens the detail view of the clicked item.
 * componentInfo - The information to display about the component.
 * id - the id of the component.
 * editMode - Boolean value telling whether edit mode is on or off.
 */
export default function DetailListItem({ name, openAndSetClickedListItem, componentInfo, id, editMode }) {
  const [listItemState, setListItemState] = useState([]);

  // Updates the component info when clicking a new component.
  useEffect(() => {
    setComponentInfo();
  }, [id, editMode]);

  /**
   * Opens the clicked list item if no other item is being edited.
   */
  function setClickedListItemIfEditModeFalse() {
    if (!editMode) {
      openAndSetClickedListItem(name, id);
    }
  }

  /** 
   * Sets the information for the components' information card in the detail list.
   */
  function setComponentInfo() {
    var result = [];
    for (const key in componentInfo) {
      // If the component info should have an ending.
      if (key.includes('*')) {
        var starIndex = key.indexOf('*');
        var title = key.substring(0, starIndex);
        var ending = key.substring(starIndex + 1);
        result.push(
          <Typography style={{
            color: "#5e6c84",
            fontSize: "12px",
            fontWeight: 600,
            paddingBottom: 8
          }}>
            {title}: {componentInfo[key]} {ending}
          </Typography>
        )
      } else {
        result.push(
          <Typography style={{
              color: "#5e6c84",
              fontSize: "12px",
              fontWeight: 600,
              paddingBottom: 8
            }}>
              {key}: {componentInfo[key]}
            </Typography>
        )
      }
    }
    setListItemState(result);
  }

  /**
   * Returns a card with information about the list item.
   */
  return (
    <Card style={{ marginBottom: 16, marginRight: 16,marginLeft: 16 }} 
    onClick={() => setClickedListItemIfEditModeFalse() }>
      <CardActionArea>
        <CardContent>
          <Typography style={{ color: "#5e6c84", fontSize: "12px",fontWeight: 600,paddingBottom: 8 }}>
            {listItemState}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}