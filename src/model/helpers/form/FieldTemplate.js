/**
 * This file exports three Objects: FieldTemplate, PlaceHolders and FieldLabels.
 * 
 * FieldTemplate:
 *  Is used in src/Components/Form/InputFields to store the values of controlled input fields
 *  and is also used to store validation results.
 *  (see react controlled components)
 * 
 *  An object of key-value pairs: (inputfield identifier)--maps to-->(inputfield value).
 *  Each change to the input fields in src/Components/Form/InputFields are reflected in FieldTemplate.
 *
 * PlaceHolders:
 *  Is used in src/Components/Form/InputFields
 *  An object of key-value pairs: (inputfield identifier)--maps to-->(inputfield placeholder)
 * 
 * FieldLabels:
 * Is used in many files where a heading to a field needs to be shown to the user.
 *
 */
import * as Constants from './FieldConstants'

let FieldTemplate = {};
FieldTemplate[Constants.PROJECT] = "";
FieldTemplate[Constants.SOP_SOCOP] = "";
FieldTemplate[Constants.TYPE_OF_RELEASE] = "";
FieldTemplate[Constants.STATUS] = "";
FieldTemplate[Constants.BSW_VERSION] = "";
FieldTemplate[Constants.REL_MEETING_WEEK] = "";
FieldTemplate[Constants.FILES_ON_SERVER_WEEK] = "";
FieldTemplate[Constants.PROJECT_MECO] = "";
FieldTemplate[Constants.PROJECT_ACCOUNT_NUMBER] = "";
FieldTemplate[Constants.SYSTEM] = "";
FieldTemplate[Constants.GROUP] = "";
FieldTemplate[Constants.APPROVER] = "";
FieldTemplate[Constants.REVIEWER] = "";
FieldTemplate[Constants.TASK] = "";
FieldTemplate[Constants.ORIGINAL_ESTIMATE] = "";
FieldTemplate[Constants.DESCRIPTION] = "";
FieldTemplate[Constants.CUSTOMER] = "";
FieldTemplate[Constants.PROJECT_RESPONSIBLE] = "";

/*Remark: engines are also stored in an html <input type="text"> 
element thus they have to be represented in string-form rather than object-form*/
FieldTemplate[Constants.ENGINES] = "[]"; 
FieldTemplate[Constants.DELORDER_A_DATE] = "";
FieldTemplate[Constants.DELORDER_A_COMMENT] = "";
FieldTemplate[Constants.DELORDER_B_DATE] = "";
FieldTemplate[Constants.DELORDER_B_COMMENT] = "";
FieldTemplate[Constants.DELORDER_C_DATE] = "";
FieldTemplate[Constants.DELORDER_C_COMMENT] = "";
FieldTemplate[Constants.DELORDER_D_DATE] = "";
FieldTemplate[Constants.DELORDER_D_COMMENT] = "";
FieldTemplate[Constants.DELORDER_E_DATE] = "";
FieldTemplate[Constants.DELORDER_E_COMMENT] = "";
FieldTemplate[Constants.DELORDER_F_DATE] = "";
FieldTemplate[Constants.DELORDER_F_COMMENT] = "";

let PlaceHolders = {};
PlaceHolders[Constants.PROJECT] = "Choose";
PlaceHolders[Constants.SOP_SOCOP] = "YYYYMM.X";
PlaceHolders[Constants.TYPE_OF_RELEASE] = "Type";
PlaceHolders[Constants.STATUS] = "R, P, PR or S";
PlaceHolders[Constants.BSW_VERSION] = "XX"+"\\"+ "XXX.XX.XX";
PlaceHolders[Constants.REL_MEETING_WEEK] = "wYYWW";
PlaceHolders[Constants.FILES_ON_SERVER_WEEK] = "wYYWW";
PlaceHolders[Constants.PROJECT_MECO] = "XXXXXX";
PlaceHolders[Constants.PROJECT_ACCOUNT_NUMBER] = "XX-XXXXXX";
PlaceHolders[Constants.DELORDER_A_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_A_COMMENT] = "Comment";
PlaceHolders[Constants.DELORDER_B_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_B_COMMENT] = "Comment";
PlaceHolders[Constants.DELORDER_C_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_C_COMMENT] = "Comment";
PlaceHolders[Constants.DELORDER_D_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_D_COMMENT] = "Comment";
PlaceHolders[Constants.DELORDER_E_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_E_COMMENT] = "Comment";
PlaceHolders[Constants.DELORDER_F_DATE] = "wYYWW";
PlaceHolders[Constants.DELORDER_F_COMMENT] = "Comment";
PlaceHolders[Constants.ENGINES_NAME] = "Engine name";
PlaceHolders[Constants.ENGINES_EMISSIONSTANDARD] = "Emission standard";
PlaceHolders[Constants.ENGINES_POWER] = "Power";
PlaceHolders[Constants.SYSTEM] = "Choose";
PlaceHolders[Constants.CUSTOMER] = "Choose";

let FieldLabels = {};
FieldLabels[Constants.PROJECT] = "Project";
FieldLabels[Constants.SOP_SOCOP] = "SOP/SOCOP";
FieldLabels[Constants.TYPE_OF_RELEASE] = "Type of Release";
FieldLabels[Constants.STATUS] = "Status";
FieldLabels[Constants.BSW_VERSION] = "BSW Version";
FieldLabels[Constants.REL_MEETING_WEEK] = "Week for Release Meeting";
FieldLabels[Constants.FILES_ON_SERVER_WEEK] = "Files on server week";
FieldLabels[Constants.PROJECT_MECO] = "Project Meco";
FieldLabels[Constants.PROJECT_ACCOUNT_NUMBER] = "Project account number";
FieldLabels[Constants.DELORDER_A_DATE] = "DelOrder A Date";
FieldLabels[Constants.DELORDER_A_COMMENT] = "DelOrder A Comment";
FieldLabels[Constants.DELORDER_B_DATE] = "DelOrder B Date";
FieldLabels[Constants.DELORDER_B_COMMENT] = "DelOrder B Comment";
FieldLabels[Constants.DELORDER_C_DATE] = "DelOrder C Date";
FieldLabels[Constants.DELORDER_C_COMMENT] = "DelOrder C Comment";
FieldLabels[Constants.DELORDER_D_DATE] = "DelOrder D Date";
FieldLabels[Constants.DELORDER_D_COMMENT] = "DelOrder D Comment";
FieldLabels[Constants.DELORDER_E_DATE] = "DelOrder E Date";
FieldLabels[Constants.DELORDER_E_COMMENT] = "DelOrder E Comment";
FieldLabels[Constants.DELORDER_F_DATE] = "DelOrder F Date";
FieldLabels[Constants.DELORDER_F_COMMENT] = "DelOrder F Comment";
FieldLabels[Constants.ENGINES_NAME] = "Engine name";
FieldLabels[Constants.ENGINES_EMISSIONSTANDARD] = "Emission Standard";
FieldLabels[Constants.ENGINES_POWER] = "Power";
FieldLabels[Constants.SYSTEM] = "System";
FieldLabels[Constants.GROUP] = "Group Name";
FieldLabels[Constants.APPROVER] = "Approver";
FieldLabels[Constants.REVIEWER] = "Reviewer";
FieldLabels[Constants.TASK] = "Task Name";
FieldLabels[Constants.ORIGINAL_ESTIMATE] = "Original estimate (in minutes)";
FieldLabels[Constants.DESCRIPTION] = "Task description";
FieldLabels[Constants.CUSTOMER] = "Customer";
FieldLabels[Constants.PROJECT_RESPONSIBLE] = "Project Responsible";

export { FieldTemplate };
export { PlaceHolders };
export { FieldLabels };
