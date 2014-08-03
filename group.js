//jsGroup grouping algorithm
//Build date: 11:36 pm, 2-Aug-2014.  Evan Strat
//Version: v0.2-beta

function Person(name, wants, cannotHaves) {
    "use strict";
    this.name = name;
    this.wants = wants;
    this.cannotHaves = cannotHaves;
    this.okayWith = function (person) {
        var isOkay = true;
        //check the person's cannotHaves
        var cannotHaves = person.cannotHaves;
        for (var i = 0; i < cannotHaves.length; i++) {
            if (cannotHaves[i] === this.name) {
                isOkay = false;
            }
        }
        return isOkay;
    };
}

function checkMutualCompat (person1, person2) { //check if two people are okay with each other
    "use strict";
    if(person1.okayWith(person2) && person2.okayWith(person1))
    {
        return true;
    }
    else
        return false;
}

function Group(id, person1, person2) {
    "use strict";
    this.id = id;
    this.person1 = person1;
    this.person2 = person2;
}

function createPerson(name, wants, cannotHaves) {
    "use strict";
    return new Person(name, wants, cannotHaves);
}

function createGroup(id, person1, person2) { //in the future, person1 and person2 will be merged into one array for everyone in a group to allow for groups of any size to be created
    "use strict";
    return new Group(id, person1, person2);
}

function makeGroups() {
    "use strict";
    event.preventDefault();
    var reportName = $('#report-name').val(),
        anyoneOkayPhrase = $('#anyone-okay-phrase').val(),
        maxChoices = parseInt($('#max-choices').val(), 10),
        people = [],
        groups = [],
        id = 1, //Used for labeling groups
    //Below: self-created method to get the data organized into a 2D array.  
        goodData = [],
        dataToProcess = $('#data').val(),
        rows = dataToProcess.split(/\n/g), //Take the unprocessed data and make each row an item in the goodData array
        rowData,
        toAdd,
        //Other variables
        rawCannotHaves,
        cannotHaves = [],
        name,
        person,
        wants = [],  //array for peoples wants
        personToAdd,
        peopleLength,
        match,
        matchName,
        skip,
        person1,
        person2,
        //personWants = [],
        i,
        j,
        k;
    if(dataToProcess !== "") {
    console.log("Rows length: " + rows.length);
    console.log(maxChoices);
    console.log((maxChoices + 2));
    for (i = 0; i < rows.length; i++) { //split rows and then add them to goodData for further processing
        goodData.push(rows[i].split($('#data-sep').val()));
    }
    //testing purposes
    for (i = 0; i < goodData.length; i++) {
        console.log(goodData[i]);
    }
    console.log(goodData[2]);
    console.log(anyoneOkayPhrase);
    for (i = 0; i < goodData.length; i++) { //loop through each row and create Person objects
        /*How the array of a row should look:
        0-1: name
        2 - (maxChoices + 1): choices
        (maxChoices + 2): array of cannotHaves
        */
        name = goodData[i][0] + " " + goodData[i][1]; //set the person's name
        console.log("Now processing data for " + name + ", index " + i);
        for (j = 2; j <= maxChoices + 1; j++) { //process wants
            if (goodData[i][j] === anyoneOkayPhrase) { //if person is okay with anyone...
                wants.push("anyone"); //...note that they are okay with anyone
                break; //...exit the for loop because there's no need to continue the loop since the person's choices after this point are irrelevant/nonexistent
            }
            if (goodData[i][j] === "" || goodData[i][j] === " ") {
                break; //This person has no more choices; stop processing wants
            }
            wants.push(goodData[i][j]); //add want to the wants array
        }

        console.log(j);
        console.log("Wants: " + wants);
        //process the cannotHaves
        console.log(goodData[i][maxChoices + 2]);
        if (goodData[i][maxChoices + 2]) {
            rawCannotHaves = goodData[i][maxChoices + 2].split(", "); //make an array containing the cannotHaves by splitting it at each comma + space occurrence (might be a setting in the future)
            for (k = 0; k < rawCannotHaves.length; k++) {
                cannotHaves.push(rawCannotHaves[k]);
            }
            if (!rawCannotHaves) { //If there's still nothing in rawCannotHaves, there is only one cannotHave
                rawCannotHaves = goodData[i][j]; //get name of cannotHave
                cannotHaves.push(rawCannotHaves); //add that person to cannotHaves
            }
            console.log("rawCannotHaves: " + rawCannotHaves);
            /*for (i = 0; i < cannotHaves.length; i++) {
                console.log(cannotHaves[i]);
            }*/
        } else {
            console.log("No cannotHaves");
        }
        //create the Person and add the object to the people array
        people.push(createPerson(name, wants, rawCannotHaves));
        //reset variables for the next person
        name = "";
        wants = [];
        rawCannotHaves = "";
        cannotHaves = [];
        }
    //create groups
    i = 0;
    while (i < people.length) { //use a while loop to loop through people to prevent issues with skipping people when a match is found and people are removed from people
        match = false;
        skip = false;
        name = people[i].name;
        if (people[i].wants[0] === "anyone") {
            console.log(people[i].name + " is okay with anyone.  Skipping.  Person " + i);
            skip = true;
            i++; //increment i since no one is being removed from people; needed to prevent an infinite loop from occurring
            console.log("No match found or the person was marked as skip; incrementing i.  i is now " + i);
        }
        else { //search for a match
            for (j = 0; j < people[i].wants.length; j++) { //for each want that the person has (the data processing algorithm stops adding wants when there are no more people for wantsyyy
                for (k = 0; k < people.length; k++) { //for each person in people
                    //if people[k].name = people[i].name, skip
                    if (name !== people[k].name) {
                        if (people[i].wants[j] === "anyone") {
                            skip = true;
                            console.log("At want " + j + ", " + name + "'s choices had not been fulfilled and " + name + " indicated that he or she is okay with anyone.  Skipping to next person.  Person " + i);
                            break;
                        }
                        else {
                            console.log(name + " - should be the same - " + people[k].wants[0]); 
                            if (name === people[k].wants[0] && people[i].wants[j] === people[k].name) {//if the person being looked at (people[k])'s first choice is this person, make the group
                                console.log("Debug info: name: " + name + " - people[k].wants[0]: " + people[k].wants[0] + " - people[i].wants[j]: " + people[i].wants[j] + " - people[k].name: " + 
                                    people[k].name);
                                match = true;
                                id = groups.length + 1;                                
                                groups.push(createGroup(id, name, people[k].name));
                                console.log("Group " + id + " - Person 1: " + name + " - Person 2: " + people[k].name);
                                
                                if (i < k) {//if i comes before k in people
                                    people.splice(k,1); //remove k from people first to prevent issues with i being removed first and moving everything in people up one index because it came before k in people
                                    people.splice(i,1);
                                }
                                else { //if i comes after k in people
                                    people.splice(i,1); //remove i from people first to prevent issues with k being removed first and moving everything in people up one index because it came before i in people
                                    people.splice(k,1);
                                }
                                break; //stop looping through people
                            }
							else if (people[i].wants[j] === people[k].name && people[k].wants[0] === "anyone") { //if this person's want is okay with anyone, create a group
								console.log("Debug info: name: " + name + " - people[k].wants[0]: " + people[k].wants[0] + " - people[i].wants[j]: " + people[i].wants[j] + " - people[k].name: " + 
                                    people[k].name + "method: match okay with anyone");
                                match = true;
                                id = groups.length + 1;                                
                                groups.push(createGroup(id, name, people[k].name));
                                console.log("Group " + id + " - Person 1: " + name + " - Person 2: " + people[k].name);
                                
                                if (i < k) {//if i comes before k in people
                                    people.splice(k,1); //remove k from people first to prevent issues with i being removed first and moving everything in people up one index because it came before k in people
                                    people.splice(i,1);
                                }
                                else { //if i comes after k in people
                                    people.splice(i,1); //remove i from people first to prevent issues with k being removed first and moving everything in people up one index because it came before i in people
                                    people.splice(k,1);
                                }
                                break; //stop looping through people
							}
                        }
                    }
                    else {
                        console.log("Both people have the same name.  Moving on.");
                    }
			    }

                if (match || skip) {//if a match has been found or this person is okay with anyone at this point
                    break; //stop going through this person's wants
                }
            }
            if(!match || skip) { //increment i only when no one is removed from people; that is, when there was no match or the person was skipped because they were okay with anyone
                i++;
                console.log("No match found or the person was marked as skip; incrementing i.  i is now " + i);
            }
        }
	}
    //process people whose choices could not be fulfilled or who were okay with anyone
    console.log("Number of people remaining in people: " + people.length);
    i = 0;
    match = false;
    while (i < people.length - 1) { //people.length - 1 is needed to prevent there from being an index that is not in the array
        person1 = people[i];
        person2 = people[i + 1];
        if (checkMutualCompat(person1, person2)) {
            //make a group
            match = true;
            groups.push(createGroup(groups.length + 1, person1.name + "*", person2.name + "*")); //groupa.length + 1 is needed to get the correct group ID number; since the gruop has not been added to groups yet, we need to add 1 to the length of groups
            people.splice(i + 1, 1);
            people.splice(i, 1);
            console.log("Group " + groups.length + " - Person 1: " + person1.name + ", Person 2: " + person2.name + " *No choices for these people could be fulfilled"); //here, we only need groups.length because the group has already been added to groups
        }
        else {
            for (j = 0; j < people.length; j++) { //see if there are any other people who will work with this person (both person1 and the other person are okay with each other)
                if(checkMutualCompat(person1, people[j]) && i !== j) { //if the two people are okay with each other, and they are not the same person (same index in people)
                   //make a group
                    console.log("j should not equal i.  i = " + i + " and j = " + j);
                    console.log(people[j] + " should be the second person in the next group");
                    match = true;
                    person2 = people[j];
                    groups.push(createGroup(groups.length + 1, person1.name + "*", person2.name + "*"));
                    people.splice(j, 1);
                    people.splice(i, 1);
                    console.log("Group " + groups.length + " - Person 1: " + person1 + ", Person 2: " + person2 + " *No choices for these people could be fulfilled");
                    break; 
                }
            }
            console.log("Person1 (" + person1 + ") and person2 (" + person2 + ") were not compatible");
        }
        if (!match)
            i++;
        else
            match = false;
    }
    if(people.length >= 2) {
        for (i = 0; i < people.length - 1; i + 2) { //make groups with anyone else in people; only go to the second to last person in people to prevent an index from being out of bounds if there is an odd number of people in people
            groups.push(createGroup(groups.length + 1, people[i].name + "*", people[i + 1].name + "*"));
            console.log("Group " + groups.length + " - Person 1: " + person1 + ", Person 2: " + person2 + " *No choices for these people could be fulfilled");
            people.splice(i + 1, 1);
            people.splice(i, 1);
        }
    }
    if (people.length === 1) { //if there is just one person left in people or there was an odd number of people in people, create a group with the remaining person
        groups.push(createGroup(groups.length + 1, people[0].name + "*", "<em>None</em>"));
        console.log("Group " + groups.length + " - Person 1: " + people[0].name + ", Person 2: None *No choices for this person could be fulfilled");
        people.splice(0,1);
    }
    
    console.log("No one should be left in people. people.length = " + people.length);
    /*var incompatible = false;
	if (people.length % 2 === 0) {
		for (j = 0; j < people.length; i + 2) {
				id = groups.length + 1;
				person1 = people[j].name + "*";
				person2 = people[j + 1].name + "*";
				//before making the group, check person1's cannotHaves
				for (k = 0; k < people[j].cannotHaves.length; k++) {
					if (people[j].cannotHaves[k] === people[j + 1].name) {
						incompatible = "person1";
						break;
					}
				}
				if (incompatible === "person1") { //if person1 is incompatible with person2, go through the array of remaining people until someone compatible is found
					for (k = 0; k < people.length; k++) //for each person in people
						for (l = 0; l < people[j].cannotHaves.length; l++) { //check to see if that person is in the current person's cannotHaves
							if (people[j].cannotHaves[l] === people[j].name) { //if so, continue on
								incompatible = true;
							}
							else {
								person2 = people[l];
							}
						}
				}
				//before making the group, check person2's cannotHaves, but only if person1 is okay with person2
				if (!incompatible) {
					for (k = 0; k < people[j].cannotHaves.length; k++) {
						if (people[j + 1].cannotHaves[k] === people[j].name) {
							if (incompatible === "person1") {
								incompatible = "both";
							}
							else {
								incompatible = "person2";
							}
							break;
						}
					}
				}
			}
			while (incompatible);
			if (!incompatible) { //if person1 and person2 are compatible, make the group; this is a separate if statement because person2 might not be okay with person1
				groups.push(createGroup(id, people[j].name + "*", people[j + 1].name + "*"));
				console.log("Group " + id + " - Person 1: " + person1 + " - Person 2: " + person2);
				people.splice(j + 1,1); //remove the higher index first from people to prevent issues with all the indices of the array moving up when the lower index is removed first
				people.splice(j,1);
			}
			while (incompatible) { //as long as the two people are incompatible
				if (incompatible === "person1") {//if person1 is incompatible with person2, find a new person2
					
				}
				else if (incompantible === "person2") {//if person2 is incompatible with person1, find a new person1
				
				}
				else {
				
				}
			}
		}
	}
    else {
        	for (j = 0; j < people.length - 1; i + 2) {
				id = groups.length + 1;
				person1 = people[j].name + "*";
				person2 = people[j + 1].name + "*";
				groups.push(createGroup(id, person1, person2));
				console.log("Group " + id + " - Person 1: " + person1 + " - Person 2: " + person2);
				people.splice(j + 1,1); //remove the higher index first from people to prevent issues with all the indices of the array moving up when the lower index is removed first
				people.splice(j,1);
			}
			//create a group for the last person
			id = groups.length + 1;
			groups.push(createGroup(id, people[0].name + "*", "None"));
			people.splice(0,1);
		}
	var goodAlternative;	
	if (people.length % 2 === 0) {
		for (j = 0; j < people.length; i + 2) {
			for (k = 0; k < people[j].cannotHaves.length; k++) {
					if (people[j].cannotHaves[k] === people[j + 1].name) {
						incompatible = "person1";
						break;
					}
				}
				if (incompatible === "person1") { //if person1 is incompatible with person2, go through the array of remaining people until someone compatible is found
					var goodAlternative = true;
					for (k = 0; k < people.length; k++) //for each person in people
							//check if person1 is okay with this person
							for (l = 0; l < people[j].cannotHaves.length; l++) {
								if (people[k] === people[j].cannotHaves[l] && people[k].name !== person1 && people[k].name !== person2)
								{
									goodAlternative = false;
								}
							}
							if(goodAlternative) {
								for (m = 0; m < people[k].cannotHaves.length; m++) {
									if (people[j] !== people[k].cannotHaves[m])
									{
										goodAlternative = false;
									}
								}
							}
							if(goodAlternative)
						}
				}
		}
	}*/
			
		/*id = groups.length + 1;
        person1 = people[0].name + "*";
        groups.push(createGroup(id, person1, "None"));
        console.log("Group " + id + " - Person 1: " + person1 + " - Person 2: None");
        people.splice(0,1);*/
    }
    //Output the groups
    $('#groups').empty(); //Get rid of previous results, if any
    if (groups.length === 0) {
        $('#groups').append('<h3 id="results-report-name">' + reportName + '</h3><div class="alert alert-block alert-danger fade in"><h4 class="alert-heading">Grouping failed</h4><p>jsGroup was unable to create any groups.  Please check your settings and try again.</p></div>');
    } else if (groups.length === 1) {
        $('#groups').append('<h3 id="results-report-name"><strong>' + reportName + '</strong><div>1 group created.</div></h3>' + '<strong>Group ' + groups[0].id + ':</strong><br />Person 1: ' + groups[0].person1 + '<br />Person 2: ' + groups[0].person2 + '</div>');
    } else {
        $('#groups').append('<h3 id="results-report-name"><strong>' + reportName + '</strong><div>' + groups.length +  ' groups created.</div></h3>');
        for (i = 0; i < groups.length; i++) {
            $('#groups').append('<div id="group' + groups[i].id + '"><strong>Group ' + groups[i].id + ':</strong><br />Person 1: ' + groups[i].person1 + '<br />Person 2: ' + groups[i].person2 + '</div>');
        }
        $('#groups').append('<br />*This person:<ul><li>indicated that he or she is okay with anyone,</li><li>had no choices that could be fulfilled, or</li><li>said he or she is okay with anyone as a later choice and had no choices prior to that choice that could be fulfilled</li></ul>'); //explain what the asterisk means
    }
    
    //old new method
    //Create groups
    /*for (i = 0; i < people.length; i++) { //For each person in people
        person = people[i].name;
        for (j = 0; j < people.length; j++) { //for each person
        match = false;
            for (k = 0; k < maxChoices; k++) { //repeat this process for the maximum number of wants a person can have
                if (people[j].name === people[i].wants[k] && people[j].wants[0] === 'anyone') { //Check if this person is okay with anyone.  If so, create the group.
                    match = true;
                    matchName = people[j].name;
                    console.log("Group: " + id + "; Group seed: " + person + "; Match: " + matchName + "; Group seed's choice number: " + k + "; Match type: match okay with anyone"); //debugging
                    break; //stop checking choices
                } else if (people[j].name === people[i].wants[k] && people[j].wants[0] === person) { //If the people[j] is person's first choice and person is people[j]'s first choice...
                    match = true;
                    matchName = people[j].name;
                    console.log("Group: " + id + "; Group seed: " + person + "; Match: " + matchName + "; Group seed's choice number: " + k + "; Match type: person's choice, choice " + k); //debugging
                    break; //stop checking choices
                }
            }
            if (match) {
                groups.push(createGroup(id, person, matchName)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            }
            else {
                console.log("No match found for " + person + "; Person's index in people: " + i);
            }
        }     
        //Make groups with remaining people who are still in the people array (any person who is okay with anyone or whose choices could not be fulfilled)
        if (people.length % 2 === 0) {
            peopleLength = people.length / 2;
            for (i = 0; i < people.length / 2; i++) {
                people[i].name += "*";
                people[i + 1].name += "*";
                groups.push(createGroup(id, people[i].name, people[i + 1].name)); //Create a new group
                people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                people.splice(i, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                //The two duplicate commands are not a mistake because after the first person is removed from people, the second person will then be at position i in people.
                id++; //Increment the group id for the next group that will be created
            }
        } else {//There is an odd number of people.  Create groups of 2 as normal and then create a group of one for the remaining person.
            for (i = 0; i < (people.length - 1) / 2 ; i++) {
                groups.push(createGroup(id, people[i].name, people[i + 1].name)); //Create a new group
                people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                people.splice(i, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                //The two duplicate commands are not a mistake because after the first person is removed from people, the second person will then be at position i in people.
                id++; //Increment the group id for the next group that will be created
            }
            groups.push(createGroup(id, people[0].name, "None"));
        }
        //Give the groups
        $('#groups').empty(); //Get rid of previous results, if any
        if (groups.length === 0) { //Error: grouping failed.  No groups were created.
            $('#groups').append('<h3>' + reportName + '</h3><div class="alert alert-block alert-warning fade in"><h4 class="alert-heading">Grouping failed</h4><p>jsGroup was unable to create any groups.  Please check your settings and try again.</p></div>');
        } else if (groups.length === 1) {
            $('#groups').append('<h3>' + reportName + '<div><strong>1 group created.</strong></div>');
        } else {
            $('#groups').append('<h3>' + reportName + '<div><strong>' + groups.length +  ' groups created.</strong></div>');
            for (i = 0; i < groups.length; i++) {
                $('#groups').append('<div id="group' + groups[i].id + '"><strong>Group ' + groups[i].id + ':</strong><br />Person 1: ' + groups[i].person1 + '<br />Person 2: ' + groups[i].person2 + '</div>');
            }
            $('#groups').append('<br />*This person:<ul><li>indicated that he or she is okay with anyone,</li><li>had no choices that could be fulfilled, or</li><li>had a first or second choice that could not be filled and said that anyone is okay for his or her second and/or third choice</li></ul>'); //explain what the asterisk means
        }
        console.log("Row data array debug:");
        console.log(rows[0]);
        console.log(rows[1]);
        console.log(rows[2]);
        console.log(rows[3]);*/
        //below: old grouping method
        /*person = people[i].name; //The name of the person being looked at
        choice1 = people[i].wants1;
        choice2 = people[i].wants2;
        choice3 = people[i].wants3;
        //Go through people until wants1 is found.  Then, check to see if that person's wants1 is this person.  If so, create a group.  Otherwise, check to see if wants2 has this person as his or her wants1.
        //If so, create a group with that person.  Do this until a match is found.  If no match is found, add to noMatches and process at the end. 
        for (j = 0; j < people.length; j++) { //This is not the best way to do this.  In the future this will be modified to accomdate an unlimited number of wants (possible once wants is an array).
            if (people[j].name === choice1 && people[j].wants1 === 'anyone') { //Check if wants1 is okay with anyone.  If so, create the group.
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            } else if (people[j].name === choice1 && people[j].wants1 === person) { //If the people[j] is person's first choice and person is people[j]'s first choice...
                //To be turned into a function in the future
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            } else if (people[j].name === choice2 && people[j].wants2 === 'anyone') { //Check if wants2 is okay with anyone.  If so, create the group.
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            } else if (people[j].name === choice2 && people[j].wants1 === person) { //If the people[j] is person's second choice and person is people[j]'s first choice...
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            } else if (people[j].name === choice3 && people[j].wants3 === 'anyone') {//Check if wants3 is okay with anyone.  If so, create the group.
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            } else if (people[j].name === choice3 && people[j].wants1 === person) { //If the people[j] is person's third choice and person is people[j]'s first choice...
                groups.push(createGroup(id, person, people[j].name)); //Create a new group
                if (i < j) { //If i is less than j...
                //...then subtract one from j when removing the people added to the group from people, so that the correct person will be removed from people
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j - 1, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                } else {
                    people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
                    people.splice(j, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
                }
                id++; //Increment the group id for the next group that will be created
            }*/
        //No else statement is needed because the person either has requests or can be processed at the end.
}