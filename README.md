# CCTMemberManagement
An application written in Google Apps Script that manages Cornell Club of Taiwan's Member system.
This script runs on the Google Sheets that keep track of the members' attendance credits. It has the following functionalities:
* Have an HTML user interface that takes the netID of the person who is signing in as input.
* Takes the netID and searches the sheets for a match using linear search.
* If there is no match:
	* a pop-up dialog box asks if the user has come to an event before or whether the user has made a mistake or not.
	* If the user answers that this is the user's first event, another user interface pops up to take the user's full name and netID.
	* The user's information is put in a new row on the non-member sheet in an alphabetical order.
	* The user's attendance is then taken for the current event he/ she is signing in for.
* If there is a match:
	* In the same row of the user's information in the sheets, the program tallies the user's attendance for the current event.
	* If the user has reached 5 credits, the program removes the person's information from the non-member sheet and copies it to a new row on the member sheet in alphabetical order.
* After the above processing has finished, the program pops up a final dialog box saying the user's attendance is taken.	