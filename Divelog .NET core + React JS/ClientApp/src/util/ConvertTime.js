export default class ConvertTime {

    convertTime(entryTime, exitTime, isUpdate) {
        let entryHoursWithMinutes = entryTime.substr(11, 5);
        let entryHours = entryHoursWithMinutes.substr(0, 2);
        entryHours = Number.parseInt(entryHours);
        entryHours += 2;

        if(entryHours < 10) {
            entryHours = "0" + entryHours;
        }

        if(isUpdate) {
            entryTime = entryTime.substr(0, 10) + "T" + entryHours + ":" + entryTime.substr(14, 2);
        } else {
            entryTime = entryTime.substr(0, 10) + " " + entryHours + ":" + entryTime.substr(14, 2);
        }
        
        if(exitTime !== null) {
            let exitHoursWithMinutes = exitTime.substr(11, 5);
            let exitHours = exitHoursWithMinutes.substr(0, 2);
            exitHours = Number.parseInt(exitHours);
            exitHours += 2;

            if(exitHours < 10) {
                exitHours = "0" + exitHours;
            }

            if(isUpdate) {
                exitTime = exitTime.substr(0, 10) + "T" + exitHours + ":" + exitTime.substr(14, 2);
            } else {
                exitTime = exitTime.substr(0, 10) + " " + exitHours + ":" + exitTime.substr(14, 2);
            }
        }
        return [entryTime, exitTime];
    }
}