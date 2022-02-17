from app import db
from app.database.models import Task

# Adds the release tasks to the database, with their name, original estimate and description. 
def add_tasks():
        db.create_all()
        task1 = Task(taskid="1", name=' Coordinate Calibration Deliveries ( DelOrd A to E )', originalEstimate="15")
        task2 = Task(taskid="2", name=' Coordinate Calibration Deliveries ( DelOrd F )', originalEstimate="15")
        task3 = Task(taskid="3", name=' Update Project\'s Order of Release in Jira', originalEstimate="15", description="h4. Instructions"+
        "\n\n( ) Re-name the \"Granskningsplanering\" Document to the correct titel (Number of the PTD + Heading of the Story)"+ 
        "\n( ) Link the PTD of the main story to the PTD of the \"Order Calibration Release\""+
        "\n( ) Check that the delivery shows as \"Bold\" afterwards in the Calibration Plan"+
        "\n\nIn case it does not link try the following:"+
        "\n* Is the engine name spelled without a space in the main story PTD (\"DC13123\") ?"+ 
        "\n* Is the egine name the same as in the \"Order Calibration Release\" PTD?"+
        "\n* Do we have the DelOrderF/E = vxxx infor in the main story?"+ 
        "\n\nNote: In case the CalPlan still does not become \"Bold\" please enter the PTD number of the story in the comment of the DelOrder after the letter (E: PTD- XXX) so it shows as a comment in CalPlan")
        task4 = Task(taskid="4", name=' Take out ECO, article no(s) and add to ECOplan + (add ECO "Milestones" in OAS )', 
            originalEstimate="(N*10)*0.5", description="h4. Instructions" + 
        "\n[file: G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\02 Instructions_2020\\ECO Handling\\NC19120 - In progress.docx]" +
        "\n\n( ) Send a mail with ”Initiate_New_ECO”-form in Outlook, ask for a new ECO, Cal Data and if needed an engine performance number for the engines"+
        "\n    - Truck and buss: mailto: stc.productcoordinationpowertrain@scania.com"+
        "\n     - Engine and I/M: mailto: STC RTMP Engine"+
        "\n( ) When handling DC07 (CUMMINS engines) notify \"NMX\", \"STC_NM_D7_ProductFollowUp\" with new ECO and article numbers used for the release to giva a heads up, see ECO-guidelines"+
        "\n\n( ) New ECO received from RTMP, New ECO:XXXXXX"+
        "\n\nTo do in EAST:"+      
        "\n   ( ) Take out ECU Software Assy (Term Number 3194)"+
        "\n   ( ) Take out ECU Assy"+
        "\n         ( ) Link the SW to BSW, Cal assy and EngPerfNo"+ 
        "\n         ( ) Link ECU Assy to HW Assy and SW Assy"+
        "\n         ( ) Add the replacement if applicable"+
        "\n\n( ) Add all informatin to Ecoplan"+
        "\n( ) Plan milestones in OAS (pip09a)"+
        "\n               - Follow NCSP:s plan for MECO (if it exists) for 2:3, 3:3, 3:4 and 4:4"+
        "\n               - FQ: Follow NECE:s plan for overlaps")
        task5 = Task(taskid="5", name=' Build structure in ECOplan, EAST, OAS and SCAT (in this order)', 
            originalEstimate="(N*10)+30", description=("h4. Instructions" +
        "\n[Instructions: G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\02 Instructions_2020\\ECO Handling\\NC19120 - In progress.docx]" +
        "\nCreate the article structure in:" +
        "\n\n*SCAT*" +
        "\n ( ) Check that the information got correctly imported from EAST. (Most problems are with those engines, that have a suffix like _L02 or _KC to the engine)" +
        "\n        ( ) China 6 engines should have \"China 6\" as category" +
        "\nIf the structe is not already build follow these steps:" +
        "\n        ( ) Import ECO(s) into SCAT (make sure to choose the right system) and fill in the missing information for all the assy numbers" +
        "\n        ( ) Build the structure" +
        "\n        ( ) Add replacement" +
        "\n\n*EAST*" +
        "\nIf not already created as a result of the \"Take out ECU Assy and ECO\" task make a note here for yourself to create the structure in EAST "+
        "\nh4. Instructions"+
        "\n( ) If needed, create a new Tree part ID in SCAT"+ 
        "\n( ) Import the assy numbers from OAS to SCAT"+
        "\n( ) Build the ECU-assy structure in SCAT"))
        task6 = Task(taskid="6", name=' Take out extra assy numbers (if the extra numbers are used for this release)', 
            originalEstimate="20", description="h4. Instructions"+
        "\nIf there are no extra numbers taken out for the engines or the extra number was used for this release"+
        "\nInstructions for taking out Assys: [file: G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\02 Instructions_2020\\ECO Handling\\NC19120 - In progress.docx]"+
        "\n( ) Take out extra numbers in EAST and create a structure (ECU Assy and SW Assy)"+
        "\n( ) Add new extra numbers in ECO-plan as extra numbers under ECO 550443")
        task7 = Task(taskid="7", name=' Take out Performance Number and Check in in Comptrans', originalEstimate="45", description="h4. Instructions" +
        "\n[Instructions: G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\02 Instructions_2020\\ECO Handling\\NC19120 - In progress.docx]" +
        "Create the article structure in:" +
        "\n\n*SCAT*" +
        "\n ( ) Check that the information got correctly imported from EAST. (Most problems are with those engines, that have a suffix like _L02 or _KC to the engine)" +
        "\n        ( ) China 6 engines should have \"China 6\" as category" +
        "\nIf the structe is not already build follow these steps:" +
        "\n        ( ) Import ECO(s) into SCAT (make sure to choose the right system) and fill in the missing information for all the assy numbers" +
        "\n        ( ) Build the structure" +
        "\n        ( ) Add replacement" +
        "\n\n*EAST*" +
        "\nIf not already created as a result of the \"Take out ECU Assy and ECO\" task make a note here for yourself to create the structure in EAST"+
        "\nh4. Instructions "+
        "\n( ) Create label for Field Test or Production using a SOP label or individual engine label. Use NC19011 for instructions on EMS calibration labels"+
        "\n\\\\guran.scania.se\\Archive\\NC\\Public\\NC19011.docx"+
        "\n\n( ) Do a test bake for at least one engine, to ensure that all parameters are checked in for the DelOrder (there shouldn’t be any warnings like \"Missing\"."+
        "\n( ) Copy the labels into this issue and the main issue. Include information about warnings"+
        "\n( ) When there is a Field Trail: Inform NETT that the labels are created by writing a comment in their baking issue and include information about warnings"+
        "\n\n\n**If this is labels OTI/FT COIN VIP 7 for Cummins engines (DC07) test files should be delivered to L:\\SW_Deliveries\\Cummins"+
        "\n( ) Bake files with \"production config\" with created labels for DC07 engines and create a new folder in SW_deliveries\\Cummins for the SOP (See previous folders to know the name convention)"+
        "\n( ) Inform the system owners (David Aslan) about the delivered files, Daniel will deliver files to EPIA.")
        task8 = Task(taskid="8", name=' Send Assy numbers to YDRE for Cert upt or YQE for campain', originalEstimate="15", description="h4. Instructions"+
        "\nh5.{color:red} Send list of ECU Assys and ECO to YDRE for certification   {color}"+
        "\n\nSend Email to: henn.moistlik@scania.com, john.gaynor@scania.com")
        task9 = Task(taskid="9", name=' Hold release meeting', originalEstimate="210", description="h4.  Instructions"+ 
        "\n\nUse the protocol template"+
        "\n\\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\01 Processbeskrivningar\\NC19081 - Handling and archiving release meeting - not archived\\NC19081_Releasemeeting.docx"+
        "\n( ) Invite to release meeting"+
        "\n   ( ) Onetrack: Make sure to check with NEFO if OCS1 should be included in the RM"+
        "\n( ) Hold the release meeting"+
        "\n( ) Mail out protocol from meeting in separate mail (don’t use meeting invitation)"+
        "\n( ) Secure follow-up issues are resolved, and update protocol if needed and re-send protocol to meeting participants"+
        "\n( ) Archive protocol when done in 3DExperience"+
        "\n\nGOAL WITH THE CALIBRATION FOR THIS RELEASE"+
        "\nRequirements for OK:"+
        "\nNone/R-status = Not ok for release (does not apply to dummy marked parameters)"+
        "\nP-status with documentation = Not ok for production/ ok for customer prototype"+
        "\nPR/S-status = Ok for release")
        task10 = Task(taskid="10", name=' Bake file and put  on production server (FPS)', originalEstimate="120", description="h4. Instructions"+
        "\n*Check list for production baking*"+
        "\n( ) Create the batch bake file with help of Bake Tools (Bake Prepper and Bake Helper)"+
        "\n( ) Bake the engine(s) "+
        "\n( ) Control the bake with Bake Checker"+
        "\n( ) *IF the file is a AB or AC chain and have a release config:"+
        "\n         - Check if the files that should have a RC actually have the RC chosen in “Edit bake settings” in the bake bath window."+
        "\n         - If it is not chosen in the “Edit bake settings”, then manually choose the RC. "+
        "\n( ) Move the baked files from \"01_Nya\" to \"02_Granskade\""+
        "\n\nh4. Instruction for baking production files:"+
        "\n# Run bake tools: [file:\\\\guran/UserMApp/PowertrainControlSystemTools/Toolbox/Installations/BakeTools/BakeTools.exe] --> Bake Prepper."+
        "\n# Use the correct ECU assy to filter all the engines that should be included in this release (fetch this information from ECO-plan)."+
        "\n# Paste information in \"Utdrag ut ECO-plan\" with the help from Bake prepper ([file:\\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\Mappstruktur\\Utdrag ur ECO-planen.xls])"+
        "\n# Double check that the information is correctly filled in"+
        "\n#* N.B: Make sure that the engine name are identical with the name in Comptrans"+
        "\n# Run Bake Tools: [file:\\\\guran/UserMApp/PowertrainControlSystemTools/Toolbox/Installations/BakeTools/BakeTools.exe] --> Bake Helper."+
        "\n#* This create a folder with the correct name and structure and it will create a .xml file that could be used for batch baking in this folder"+
        "\n## Default:  [file:\\\\G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\Mappstruktur]. "+
        "\n## Can also choose to create the folder directly in \"Slussen\": [file:L:\\NE_Production_archive\\Sluss_produktionsfiler] - choose the correct folder depending on with engine system and then choose \"01_Nya\"]."+
        "\n# In Comptrans, open the baking file and bake the engine(s)"+
        "\n# Copy the .cpl-folder to the correct production folder and archive folder:"+
        "\n#* Application archive: [file:L:\\NE_Application_archive] - make sure to follow the pattern in the sub-folders so it's easier to find the baked files in the future"+
        "\n#* Production archive sluss: [file:L:\\NE_Production_archive\\Sluss_produktionsfiler] - choose the correct sub-folder for the system and then choose \"01_Nya\"."+
        "\n# Run Bake Tools again: [file:\\\\guran/UserMApp/PowertrainControlSystemTools/Toolbox/Installations/BakeTools/BakeTools.exe] --> Bake Checker."+
        "\n#* This reviews that the baked files includes the correct information compared to ECO-plan and Utdrag_ur_ECO-plan."+
        "\n# If everything is OK with the review of the baked files, move them to the folder \"02_Granskade\".")
        task11 = Task(taskid="11", name=' hög PDxxxxxxx (PR) och ECOxxxxxx (3:4) + timesetting', originalEstimate="60", description="h4. Instructions"+
        "\n( ) When introducing the BSW with the ECU ECO, link this issue to the System owners Jira issue about BSW \"to-do list\""+
        "\n\n*Take out release meeting report in 3Dexperience*"+
        "\n( ) Take out a new technical report for the release meeting decision in 3Dexperience, this document should be referenced in the ECO description "+
        "\n(See \\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\01 Processbeskrivningar\\NC19081 - Handling and archiving release meeting - not archived\\NC19081_Releasemeeting.docx for how to take it out)"+
        "\nRelease meeting document: ___"+
        "\n    ( ) Also save the TR Number in column R in Ecoplan under your ECO"+
        "\n\n*PD-raise to PR in 3Dexperience*"+
        "\n( ) Take out PD in PR-status "+
        "\n( ) Add included part numbers"+
        "\n( ) Add distribution list"+
        "\n( ) Create cover sheet"+
        "\n     ( ) Dubbelcheck that the BSW-assy number is correct for this release, check the assy number in EAST"+
        "\n( ) Send for PR-raise"+
        "\n( ) PD in PR status "+
        "\n\n*ECO-raise to 3:4 in OAS*"+
        "\n( ) Fill in the final text in ECO Description"+
        "\n           ( ) When creating the ECO Description, get the Customer Impact information from the system owners by sending an e-mail to stc.ems@scania.com"+
        "\n           ( ) Include all SOP issues in the description (System owners should attach a txt file with the text that should be included in this jira issue, remind them if they haven't done that yet."+
        "\n           ( ) When creating the ECO Description, get the System test report number and the Validation test report number from the object test leaders."+
        "\n           ( ) Add reference to the release meeting document that was taken out in 3Dexperience"+
        "\n( ) Create structure in OAS using \"Strukturhjälp\" "+
        "\n( ) If Basic SW is introduced in the ECO, add articles connected to the BSW in the bottom of the Structure, check in EAST what numbers should be included"+
        "\n            - FMEA"+
        "\n            - PD EOL"+
        "\n            - PD QA"+
        "\n            - PD System Description"+
        "\n            - DIAGNOSTIC TROUBLE CODE SPEC"+
        "\n            - SPEC DIAGNOSTIC PROTOCOL"+
        "\n( ) Phase out old assy numbers with Globally discontinued (Edit Part in OAS) (Don’t phase out BSW ECO)"+
        "\n( ) Check under search by ECO, select parts affected(default), make sure that all parts connected are correct"+
        "\n( ) Add the \"Only Aftermarket\" tag to all engines that are only for aftermarket according to ECOplan"+
        "\n( ) Check that correct assy numbers are introduced (In Oas enter your eco in the functions use View Co & Search by Co-Parts affected/globally discontinued parts)"+
        "\n( ) Secure that milestones are correct and adjusted if needed to fit the project time plan(Use:View CO(enter eco)- Milestones)"+
        "\n( ) Secure that the time setting (start of production is correct, if it needs to be changed, contact the following"+
        "\n                               ** Scania Engines: Stefan Kreku at KETD "+
        "\n                               ** Trucks & Buses: Mailbox \"STC ECO Red Arrow\" resp \"STC ECO Green Arrow\" (depending on red or green arrow project)"+
        "\n( ) Check that underlying articles are in PR status before sending the ECU ECO for raise (Article status can be found in EAST; underlying assys should be in PR-status) "+
        "\n\n( ) Send for 3:4 with Outlook-form, fill in the Checklist found in \"PD & ECO-hantering\" under chapter 8 - \"Send ECO for raise\" in the mail message field."+
        "\n      ( ) For all DC07 engines, send an Info that the ECO is beeing raised also to: “STC_NM_D7_ProductFollowUp”           "+    
        "\n\n( ) ECO in 3:4"+
        "\n\nDetailed instructions:"+
        "\n* ECO-/PD-handeling for NCSX Release-Managers : [file: G:\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\02 Instructions_2020\\ECO Handling\\NC19120 - In progress.docx]"+
        "\n* Digital Routine ECO RTM: [http://inline.scania.com/scripts/cgiip.exe/WService=inline/cm/file/showfile.p?fileid=359688]"+
        "\n* Product coordinator:"+
        "\n** For engines; STC RTMP Engine"+
        "\n** For Cummins-ECO, notify NMX, see ECO-guidelines."+
        "\n** Cummins process/dokument: \\\\spct-prod-sodertalje.scania.com\\ES$\\ES_EcuData_Cummins ")
        task12 = Task(taskid="12", name=' Prepare for release meeting', originalEstimate="120", description="h4. Instructions for Calibration Coordinators for preparing the presentation of the calibration status"+
        "\n( ) Create a new calibration presentation from this template: \\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\NCSX\\Dokument\\Kalibreringskoordinator\\03 Mallar\\Mall for Release Meeting Master.pptx"+
        "\n       ( ) Describe all deviations from status S (Not for Onetrack) "+
        "\n       ( ) Show all diffs against what was included in the field trail (FT) or the last version approved for production. Add the Link of the Cal issue for all diffs and check if they are CCB approved. "+
        "\n       ( ) Describe the ECO level (should be in 3:4 for the release meeting)"+
        "\n\n( ) Checkst that are good to do before the release meeting"+
        "\n      ( ) All SOP issues are resolved (Ask System owners if they are ok)"+
        "\n      ( ) FMEA and DTC is done (Ask NCSR)"+
        "\n      ( ) SW/CAL PD and BSW PD is sent for 3:4 in 3Dexperience"+
        "\n\nh6. Instructions for creating the Diff Prio Tabel  "+
        "\n* Choose your SW track in Calib and right click \"Compare versions with different revisions\""+
        "\n* Select the correct revision for the past label you want to compare to and head (Versions to compare; should be2) "+
        "\n* Check all engine setups included in the release "+
        "\n* If applicable, filter by parameter name"+
        "\n* Compare "+
        "\n\n* Click on the litle excel symbol and select \"save as\""+
        "\n* Create a new folder in this location \"\\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\Common\\Produkt\\EMS\\Kalibrering\\Diff- & Avvikelserapporter\" and save the file there"+
        "\n* Mark the whole table in \"Grid Data\" and choose \"Insert\" -> \"PivotTable\""+
        "\n\nDesign a pivot table:"+
        "\n** Go into design option tab and choose \"Subtotals\" -> \"Do not show subtotals\""+
        "\n** Go into design option tab and choose \"Report Layout\" -> \"Show in tabular form\""+
        "\n** Filter: Value = TRUE; Dummy = FALSE"+
        "\n** Columns: (Optional) \"Engine types\""+
        "\n** Row (following order): Group, Parameter, Engine Type, Status Comment, "+
        "\nInsert CAL Reference"+
        "\nFor the release meeting, all changes that have been made in the software should have a linked Cal Issue. Open the Cal ID in Jira and check if the issue was on CCB and has been approved.Follow the following steps to insert the Cal reference: "+
        "\n** Insert two new rows at the end of the tabel: Cal issue and CCB ok"+
        "\n** If applicable, coppy the status commen CAL refence into your new column"+
        "\n** Check the parameter and the engine affected. Open one of the engines in Comptrans and search for the parameter. In the column \"Reference\" you can find a CAL ID, copy that in your new column \"Cal-issue\""+
        "\n** Check all cal issues if they have been on CCB"+
        "\n** For those cal issues without an ok and those where you couldn't find the reference send the list to the respective group manager and ask if this is ok to be released. Put your manager in CC")
        task13 = Task(taskid="13", name=' Raise BSW xxxxxxx (S)(CM/IL)', originalEstimate="30", description="h4. Instructions"+
        "\nThis can be done when the ECO is in the status 3:4."+
        "\n( ) Check if this ECO is dependent on any other ECO (for example New GSC must be introduced at the samt time as OC (EMO) engines). If so secure that the ECOs have a dependency and the same SOP/SOCOP."+
        "\n( ) Send mail to the responsible for the time setting and ask them to time set the ECO "+
        "\n** Scania Engines: Stefan Kreku at KETD "+
        "\n** Trucks & Buses: Mailbox \"STC ECO Red Arrow\" resp \"STC ECO Green Arrow\" (depending on red or green arrow project)")
        task14 = Task(taskid="14", name=' Change flags in SCAT to production + Peer review of assys', originalEstimate="20", description="h4. Instructions"+
        "\nWhen flagging in SCAT you should have a colleague to peer review the assy strucuture in SCAT"+
        "\n( ) Check all assy numbers in SCAT compared to ECO-plan"+
        "\n( ) Check that new engine types without engine performance number are set to \"0000000\" or \"0\" (depending on system)"+
        "\n( ) If everything looks ok, flag in SCAT")
        task15 = Task(taskid="15", name=' Raise PDxxxxxxx (PR) and ECOxxxxxx (4:4)', originalEstimate="60", description="*PD-raise to S in 3Dexperience*"+
        "\n( ) Add zip file ( containing CPL folders) to the attachment section of the PD document."+
        "\n( ) Double check the information on the PD"+
        "\n( ) Send for S-raise in 3Dexperience to managers."+
        "\n*ECO-raise to 4:4 in OAS*"+
        "\n( ) Double check if the raise is approved on the release meeting"+
        "\n\\\\global.scd.scania.com\\Dfs04\\ControlSystemPlatformAndEngineControl\\30_Meetings\\Release_meetings\\NC_Release_meeting_decision_log.xlsx"+
        "\n( ) Scania Engines: If the meeting is not archived in the log, you can send for raise and let Mark Scott know he should archive it when you are sending it for 4:4."+
        "\n( ) Check that underlying articles are in S status before sending the ECU ECO for raise (BSW assy, test reports and PD should be in S-status)"+
        "\n( ) Ask the CM to raise the BSW PD to S-status if not already done"+
        "\n Send for 4:4 with Outlook-form"+
        "\n( ) Fill in the Checklist found in \"PD & ECO-hantering\" under chapter 8 - \"Send ECO for raise\" in the mail message field."+
        "\n( ) For all DC07 engines, send also to: “STC_NM_D7_ProductFollowUp”"+
        "\n( ) ECO in 4:4"+
        "\n* Product coordinator:"+
        "\n** For engines; STC RTMP Engine"+
        "\n** For I/M; Christian Lundgren"+
        "\n** For GMS; Simon Sandström")
        task16 = Task(taskid="18", name=' Create Diff table for Calibrating  Groups, (onetrack)', originalEstimate="60", description="h4. Instructions"+
        "\nA diff table containing the past label and BSW should be available for the groups calibrating."+
        "\n( ) Retrieve all past label versions for the diff table"+
        "\n( ) Retrieve all past BSW versions for the diff table"+
        "\n( ) Create Diff table with information and make it available to groups"+
        "\n\nInstructions for creating the Diff Prio Tabel  "+
        "\nMethod A: (Usefull when comparing many engines at once) "+
        "\n* Choose your SW track in Calib and right click \"Compare versions with different revisions\""+
        "\n* Select the correct revision for the past label you want to compare to and head (Versions to compare; should be2) "+
        "\n* Check all engine setups included in the release "+
        "\n* If applicable, filter by parameter name"+
        "\n* Compare "+
        "\n\nMethod B: (Usefull when comparing two engines) "+
        "\n* Choose your SW track in Calib and your engine"+
        "\n* Right click on the engine \"Compare with engine setup\""+
        "\n* Select the correct revision for the past label you want to compare to and head (Versions to compare; should be2) "+
        "\n* Check all engine setups included in the release "+
        "\n* If applicable, filter by parameter name"+
        "\n* Compare"+
        "\n\n* Click on the litle excel symbol and select \"save as\""+
        "\n* Create a new folder in this location \"\\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\Common\\Produkt\\EMS\\Kalibrering\\Diff- & Avvikelserapporter\" and save the file there")
        task17 = Task(taskid="19", name=' Create Diff table for Calibrating  Groups, (Onetrack DelOrderF)',  originalEstimate="60", description="h4. Instructions"+
        "\nA diff table containing the past label and BSW should be available for the groups calibrating."+
        "\n( ) Retrieve all past label versions for the diff table"+
        "\n( ) Retrieve all past BSW versions for the diff table"+
        "\n( ) Create Diff table with information and make it available to groups"+
        "\n\nInstructions for creating the Diff Prio Tabel  "+
        "\nMethod A: (Usefull when comparing many engines at once) "+
        "\n* Choose your SW track in Calib and right click \"Compare versions with different revisions\""+
        "\n* Select the correct revision for the past label you want to compare to and head (Versions to compare; should be2) "+
        "\n* Check all engine setups included in the release "+
        "\n* If applicable, filter by parameter name"+
        "\n* Compare "+
        "\n\nMethod B: (Usefull when comparing two engines) "+
        "\n* Choose your SW track in Calib and your engine"+
        "\n* Right click on the engine \"Compare with engine setup\""+
        "\n* Select the correct revision for the past label you want to compare to and head (Versions to compare; should be2) "+
        "\n* Check all engine setups included in the release "+
        "\n* If applicable, filter by parameter name"+
        "\n* Compare"+
        "\n\n* Click on the litle excel symbol and select \"save as\""+
        "\n* Create a new folder in this location \"\\\\global.scd.scania.com\\dep\\RoD\\NC\\NCS\\Common\\Produkt\\EMS\\Kalibrering\\Diff- & Avvikelserapporter\" and save the file there")
        task18 = Task(taskid="20", name='Review för uppstart samt upp till DelOrd A', originalEstimate="120", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task19 = Task(taskid="21", name='Review up to DelOrd B', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task20 = Task(taskid="22", name='Review up to DelOrd C', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task21 = Task(taskid="23", name='Review up to DelOrd D', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task22 = Task(taskid="24", name='Review up to DelOrd E', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task23 = Task(taskid="25", name='Approve calibration up to DelOrd E', originalEstimate="15", description="h4. Information"+
        "\n*Instruction for review and approval are located in the wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\n*OBS! When you are approving you are confirming that your group have test baked, any warnings and missing parameters are verified by you*"+
        "\n\n( ) Put the issue in Status = Planning/Approved/In progress when it has been received and/if it has been planned"+
        "\n( ) Put the issue in Status = Resolved or Postponed no later than the deadline, *Thursday evening*"+
        "\n( ) Check that the calibration doesn’t affect certifications in the table below before resolving the issue. Please refer to NE document: NE15146 (it will be the updated document currently in progress)"+
        "\n||Emissions| *Yes/No*|"+
        "\n||Diagnostics| *Yes/No*|"+
        "\n||Noise| *Yes/No*|"+
        "\n||ADR| *Yes/No*|"+
        "\n||AECD| *Yes/No*|"+
        "\n||Affects PEMS/COP| *Yes/No* (Not GMS)|")
        task24 = Task(taskid="26", name='Review up to DelOrd E (Higher Status)', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task25 = Task(taskid="27", name='Approve calibration up to DelOrd E (Higher Status', originalEstimate="15", description="h4. Information"+
        "\n*Instruction for review and approval are located in the wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\n*OBS! When you are approving you are confirming that your group have test baked, any warnings and missing parameters are verified by you*"+
        "\n\n( ) Put the issue in Status = Planning/Approved/In progress when it has been received and/if it has been planned"+
        "\n( ) Put the issue in Status = Resolved or Postponed no later than the deadline, *Thursday evening*"+
        "\n( ) Check that the calibration doesn’t affect certifications in the table below before resolving the issue. Please refer to NE document: NE15146 (it will be the updated document currently in progress)"+
        "\n||Emissions| *Yes/No*|"+
        "\n||Diagnostics| *Yes/No*|"+
        "\n||Noise| *Yes/No*|"+
        "\n||ADR| *Yes/No*|"+
        "\n||AECD| *Yes/No*|"+
        "\n||Affects PEMS/COP| *Yes/No* (Not GMS)|")
        task26 = Task(taskid="28", name='Create label and test bake for release (DelOrd E)', originalEstimate="45", description="h4. Instructions"+ 
        "\n( ) Create label for Field Test or Production using a SOP label or individual engine label. Use NC19011 for instructions on EMS calibration labels"+
        "\n\\\\guran.scania.se\\Archive\\NC\\Public\\NC19011.docx"+
        "\n\n( ) Do a test bake for at least one engine, to ensure that all parameters are checked in for the DelOrder (there shouldn’t be any warnings like \"Missing\"."+
        "\n( ) Copy the labels into this issue and the main issue. Include information about warnings"+
        "\n( ) When there is a Field Trail: Inform NETT that the labels are created by writing a comment in their baking issue and include information about warnings"+
        "\n\n\n**If this is labels OTI/FT COIN VIP 7 for Cummins engines (DC07) test files should be delivered to L:\SW_Deliveries\Cummins"+
        "\n( ) Bake files with \"production config\" with created labels for DC07 engines and create a new folder in SW_deliveries\Cummins for the SOP (See previous folders to know the name convention)"+
        "\n( ) Inform the system owners (David Aslan) about the delivered files, Daniel will deliver files to EPIA.")
        task27 = Task(taskid="29", name='Create label and test bake for release (DelOrd E Higher Status)', originalEstimate="45", description="")
        task28 = Task(taskid="30", name='Bake files for test (NETT) (1st DelOrd E)', originalEstimate="45", description="h4. Instructions"+
        "\nSee local instructions on NETT for baking SW for field trail")
        task29 = Task(taskid="31", name='Bake files for test (NETT) (2nd DelOrd E)', originalEstimate="45", description="")
        task30 = Task(taskid="32", name='Review up to DelOrd F', originalEstimate="60", description="h4. Information"+
        "\nInstructions for review and approval can be found in wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\nSet this issue in *Status = Planning/Approved/In progress* when it has been received and/or planed "+
        "\nSet this issue in Resolved or Postponed at the latest deadline *(usually Thursday evening)*"+
        "\n\nGeneral Checklist for all groups: "+
        "\n*Task to do in CalLib*"+
        "\n( ) Check diffs (for review towards DelOrder F)"+
        "\n( ) Check status of parameters"+
        "\n( ) Check that there are no parameters without DelOrder and CalOrder"+
        "\n          ( ) If yes, please check in the corresponding DelOrder for those parameters"+
        "\n( ) Check that every parameter is well documented:"+
        "\n     C23"+
        "\n          ( ) Prop Status Comment"+
        "\n          ( ) Status Follow-up Date"+
        "\n          ( ) JIRA reference (If the calibration changes after delOrdE don't forget to add a jira reference to the CAL/EMS issue)"+
        "\n( ) When checking in parameters make sure to check in all tracks upward (E.g. calibration is for 7x.52.xx track, check in calibration in track 7x.52.xx/7x.53.xx/7x.54.xx/7x.55....and up)"+
        "\n*( ) Do a test bake - Very Important due to a lot of warnings and error messages*"+
        "\n\n*Task to do in JIRA*"+
        "\n( ) Ping the STC Calibration Coordinator team if some parameters deviate from the expected Status. "+
        "\nAs a comment in this PTD: "+
        "\n          ( ) Write a list of all the parameters that deviate from the expected Status (if any)"+
        "\n          ( ) Write the reason for the deviation"+
        "\n          ( ) Write the consequences of this deviation"+
        "\n          ( ) Write when is the solutions possible due date"+
        "\n\nFor Scania Engines:"+
        "\n( ) Review the correct DIMA Dep Value in the system S7_S8"+
        "\n( ) Review the correct K Dep Value (Legislation Market) S7_S8"+
        "\n\n*NESX Specific Instructions*"+
        "\nOpen the correct engine setup in the correct track and filter for NESX/NCSX parameters"+
        "\n( ) Check the value for the following two parameters: "+
        "\n          ( ) dieh_x_apprNumber_aU08c (Engine Performance Number) "+
        "\n          ( ) ecui_x_engineType_aU08c (Engine Name) "+
        "\n                ( ) Engine names with C01/K01/CK01/L02 for DC07/AC should be named without this last suffix in comptrans, ex. \"DC07 113\""+
        "\n                ( ) China 6 Engines should be named with suffix after engine \" L/W02\""+
        "\n( ) If value is incorrect, ceck-in the correct value  (if it's a temporary engine performance number put 0000000)")
        task31 = Task(taskid="33", name='Approve calibration up to DelOrd F', originalEstimate="15", description="h4. Information"+
        "\n*Instruction for review and approval are located in the wiki: [https://wikiinline.scania.com/wiki/Instruktioner_f%C3%B6r_granskning_och_godk%C3%A4nnande_av_kalibrering_(EMS_Calibration)]"+
        "\n\n*OBS! When you are approving you are confirming that your group have test baked, any warnings and missing parameters are verified by you*"+
        "\n\n( ) Put the issue in Status = Planning/Approved/In progress when it has been received and/if it has been planned"+
        "\n( ) Put the issue in Status = Resolved or Postponed no later than the deadline, *Thursday evening*"+
        "\n( ) Check that the calibration doesn’t affect certifications in the table below before resolving the issue. Please refer to NE document: NE15146 (it will be the updated document currently in progress)"+
        "\n||Emissions| *Yes/No*|"+
        "\n||Diagnostics| *Yes/No*|"+
        "\n||Noise| *Yes/No*|"+
        "\n||ADR| *Yes/No*|"+
        "\n||AECD| *Yes/No*|"+
        "\n||Affects PEMS/COP| *Yes/No* (Not GMS)|")
        task32 = Task(taskid="34", name='Create label and test bake for release (DelOrd F)', originalEstimate="45", description="h4. Instructions"+ 
        "\n( ) Create label for Field Test or Production using a SOP label or individual engine label. Use NC19011 for instructions on EMS calibration labels"+
        "\n\\\\guran.scania.se\\Archive\\NC\\Public\\NC19011.docx"+
        "\n\n( ) Do a test bake for at least one engine, to ensure that all parameters are checked in for the DelOrder (there shouldn’t be any warnings like \"Missing\"."+
        "\n( ) Copy the labels into this issue and the main issue. Include information about warnings"+
        "\n( ) When there is a Field Trail: Inform NETT that the labels are created by writing a comment in their baking issue and include information about warnings"+
        "\n\n\n**If this is labels OTI/FT COIN VIP 7 for Cummins engines (DC07) test files should be delivered to L:\SW_Deliveries\Cummins"+
        "\n( ) Bake files with \"production config\" with created labels for DC07 engines and create a new folder in SW_deliveries\Cummins for the SOP (See previous folders to know the name convention)"+
        "\n( ) Inform the system owners (David Aslan) about the delivered files, Daniel will deliver files to EPIA.")
        task33 = Task(taskid="35", name='( NESR Approve) 3:4 Raise Tasks, DTC Spec completed for PDxxxxxxx & ECOxxxxxx', originalEstimate="120", description="h4. Instructions"+
        "\nBefore Raising ECO to (3:4) and PD documents toPR, DTC Specifications must me completed by NCSR"+
        "\n( ) Confirmation that DTC Specifications are finished")
        task34 = Task(taskid="36", name='(NESR Approve) 3:4 Raise Tasks, FMEA for PDxxxxxxx & ECOxxxxxx', originalEstimate="120", description="h4. Instructions"+
        "\nWhen Raising ECO to (3:4) and PD document to (PR) FMEA must me completed."+
        "\n( ) Confirmation FMEA is finished")

        # Add tasks to database
        db.session.add(task1)
        db.session.add(task2)
        db.session.add(task3)
        db.session.add(task4)
        db.session.add(task5)
        db.session.add(task6)
        db.session.add(task7)
        db.session.add(task8)
        db.session.add(task9)
        db.session.add(task10)
        db.session.add(task11)
        db.session.add(task12)
        db.session.add(task13)
        db.session.add(task14)
        db.session.add(task15)
        db.session.add(task16)
        db.session.add(task17)
        db.session.add(task18)
        db.session.add(task19)
        db.session.add(task20)
        db.session.add(task21)
        db.session.add(task22)
        db.session.add(task23)
        db.session.add(task24)
        db.session.add(task25)
        db.session.add(task26)
        db.session.add(task27)
        db.session.add(task28)
        db.session.add(task29)
        db.session.add(task30)
        db.session.add(task31)
        db.session.add(task32)
        db.session.add(task33)
        db.session.add(task34)
