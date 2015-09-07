jsGroup
=======
[![Codacy Badge](https://api.codacy.com/project/badge/eaf4d3c7d34843718aa83a3ccede033e)](https://www.codacy.com/app/evan-strat/jsgroup)

jsGroup makes groups.

Current features:
- Create groups of 2
- Take one or more choices into account for each person
- Consider who a person really doesn't want to be grouped with
- Use more lax criteria to make a group when a person didn't get grouped with any of his  or her choices
- Try to not put a person in a group with someone he or she said he or she did not want to be grouped with

    
Known limitations:
- Only groups of two can be created.  (will change eventually)

The basic methodology:
- The user submits a dataset and some information about it.
- A data processing algorithm parses the data and creates an object-oriented model of the data.
- A group-making algorithm uses the objects to identify matches and creates group.  The factors it takes into account include: the person's choices, whether the person is okay with being grouped with anyone, whether the person was unable to be grouped with any of his or her choices, and who the person does not want to be put into a group with.
- The results are outputted in an easy to read format.
    
Other notes:
- At the end of making groups, the remaining people who couldn't be put into groups are then put into groups.  This process tries to keep people who do not want to be in a group together out of the same group.  It's not perfect, but it works pretty well.
- Lastly, if there are still people that have not been put into a group at this point, the remaining people will just be put into groups.  At this point, there is no other information (that the algorithm knows of) that can be factored in to making groups.  Obviously, it is here where a human and a computer would differ in the grouping choices because a human can consider other factors that jsGroup doesn't.

The old readme, if you wish:
>jsGroup is grouping software that allows you to take data that contains people's names, people with whom they would like to be in a group, and people with whom they don't want to be in a group and make groups based on the data.  The algorithm, which is currently in beta, will evaluate each person, in the order that they appear in the data, and figure out who the best person with whom to group them is.  It will take into consideration who the person wants and doesn't want.  If a person is okay with anyone being in their group, they will be saved until the end, at which point they will be grouped with the other people who are okay with anyone and also anyone whose preferences were not met; jsGroup will indicate these people with an asterisk at the end of their name.  Note that asterisks will not be appended to the names of those people who were okay with anyone and were wanted by someone else.
