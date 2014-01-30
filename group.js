//jsGroup grouping algorithm
//Build date: 9:57 pm, 10/27/2013.  Evan Strat
//Version: 0.1 beta

function Person(name, wants1, wants2, wants3, cannotHaves) {
//Consider changing wants to an array in a future version
    "use strict";
    this.name = name;
    this.wants1 = wants1;
    this.wants2 = wants2;
    this.wants3 = wants3;
    this.cannotHaves = cannotHaves;
}

//Consider changing persons into an array in a future version
function Group(id, person1, person2) {
    "use strict";
    this.id = id;
    this.person1 = person1;
    this.person2 = person2;
}

function createPerson(name, wants1, wants2, wants3, cannotHaves) {
    "use strict";
    return new Person(name, wants1, wants2, wants3, cannotHaves);
}

function createGroup(id, person1, person2) {
    "use strict";
    return new Group(id, person1, person2);
}

function makeGroups() {
    "use strict";
    var reportName = $('#report-name').val(),
        anyoneOkayPhrase = $('#any-okay-phrase').val(),
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
        cannotHaves,
        name,
        person,
        choice1,
        choice2,
        choice3,
        wants1,
        wants2,
        wants3,
        personToAdd,
        peopleLength,
        i,
        j;

    for (i = 0; i < rows.length; i++) { //For each row of data...
        rowData = rows[i]; //The row that is being split up
        toAdd = rowData.split($('#data-sep').val()); //Make an array of the row data by splitting the row data at the row seperator indicated in the setup form
        goodData.push(toAdd); //Add the array of the now-processed row data to the goodData array
    }
    /*How the array of a row should look:
    0-1 = name of person
    2-4 = choices
    5 = cannotHaves
    */
    //For each person in goodData, loop through and run a function that returns a new Person
    for (i = 0; i < goodData.length; i++) {
        name = goodData[i][0] + " " + goodData[i][1];
        if (goodData[i][2] === anyoneOkayPhrase) {
            wants1 = "anyone";
        } else {
            wants1 = goodData[i][2];
        }
        if (goodData[i][3] === anyoneOkayPhrase) {
            wants2 = "anyone";
        } else {
            wants2 = goodData[i][3];
        }
        if (goodData[i][4] === anyoneOkayPhrase) {
            wants3 = "anyone";
        } else {
            wants3 = goodData[i][4];
        }
        cannotHaves = goodData[i][5];
        personToAdd = createPerson(name, wants1, wants2, wants3, cannotHaves);
        people.push(personToAdd);
    }

    //Create groups
    for (i = 0; i < people.length; i++) { //For each person in people
        person = people[i].name; //The name of the person being looked at
        choice1 = people[i].wants1;
        choice2 = people[i].wants2;
        choice3 = people[i].wants3;
        console.log(people.length);
        //Go through people until wants1 is found.  Then, check to see if that person's wants1 is this person.  If so, create a group.  Otherwise, check to see if wants2 has this person as his or her wants1.
        //If so, create a group with that person.  Do this until a match is found.  If no match is found, add to noMatches and process at the end. 
        for (j = 0; j < people.length; j++) { //This is not the best way to do this.  In the future this will be modified to accomdate an unlimited number of wants (possible once wants is an array).
            if (people[j].name === choice1 && people[j].wants1 === 'anyone') { //Check if wants1 is okay with anyone.  If so, create the group.
                console.log(people[j].name + "* -1- " + person);
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
                console.log(people[j].name + " -1- " + person);
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
                console.log(people[j].name + "* -2- " + person);
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
                console.log(people[j].name + " -2- " + person);
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
                console.log(people[j].name + "* -3- " + person);
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
                console.log(people[j].name + " -3- " + person);
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
            }
        }
        //No else statement is needed because the person either has requests or can be processed at the end.
    }
    //Make groups with remaining people who are okay with anyone (anyone still in people)
    if (people.length % 2 === 0) {
		console.log("even");
        peopleLength = people.length / 2;
        for (i = 0; i < people.length / 2; i++) {
            people[i].name += "*";
            people[i + 1].name += "*";
            console.log(people[i].name + "  -  " + people[i + 1].name);
            groups.push(createGroup(id, people[i].name, people[i + 1].name)); //Create a new group
            people.splice(i, 1); //Remove person from people, so he/she will not be put into two different groups
            people.splice(i, 1); //Remove the second member of the new group from people, so he/she will not be put into two different groups
            //The two duplicate commands are not a mistake because after the first person is removed from people, the second person will then be at position i in people.
            id++; //Increment the group id for the next group that will be created
        }
    } else {//There is an odd number of people.  Create groups of 2 as normal and then create a group of one for the remaining person.
		console.log("odd");
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
        console.error("Grouping failed");
    } else if (groups.length === 1) {
        $('#groups').append('<h3>' + reportName + '<div><strong>1 group created.</strong></div>');
    } else {
        $('#groups').append('<h3>' + reportName + '<div><strong>' + groups.length +  ' groups created.</strong></div>');
        for (i = 0; i < groups.length; i++) {
            $('#groups').append('<div id="group' + groups[i].id + '"><strong>Group ' + groups[i].id + ':</strong><br />Person 1: ' + groups[i].person1 + '<br />Person 2: ' + groups[i].person2 + '</div>');
        }
		$('#groups').append('<br />*This person:<ul><li>indicated that he or she is okay with anyone,</li><li>had no choices that could be fulfilled, or</li><li>had a first or second choice that could not be filled and said that anyone is okay for his or her second and/or third choice</li></ul>'); //explain what the asterisk means
    }
//for debugging purposes
    console.log(rowData);
    console.log(toAdd);
    console.log(goodData);
    console.log(people);
    console.log(groups);
}
