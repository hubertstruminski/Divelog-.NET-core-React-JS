export default class ConvertDMTime {

    formatDate(inputDate, isDirectMessage) {
        let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "June.", "July.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

        let date = new Date(inputDate);
        let splittedDate = date.toString().split(" ");

        let year = date.getFullYear();
        let indexOfMonth = date.getMonth();
        let month = months[indexOfMonth];
        let days = splittedDate[2];
        let hours = date.getHours();
        let minutes = date.getMinutes();

        let currentDate = new Date();
        let splittedCurrentDate = currentDate.toString().split(" ");

        if(year === currentDate.getFullYear() && indexOfMonth === currentDate.getMonth() && days === splittedCurrentDate[2]) {
            if(hours < 10) {
                hours = "0" + hours;
            }
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes;
        }

        if(year === currentDate.getFullYear()) {
            if(isDirectMessage) {
                if(hours < 10) {
                    hours = "0" + hours;
                }
                if(minutes < 10) {
                    minutes = "0" + minutes;
                }
                return month + " " + days + " " + hours + ":" + minutes;
            }
            return month + " " + days;
        }

        if(days < 10) {
            days = "0" + days;
        }

        indexOfMonth = indexOfMonth + 1;

        if(indexOfMonth < 10) {
            indexOfMonth = "0" + indexOfMonth;
        }
        if(isDirectMessage) {
            if(hours < 10) {
                hours = "0" + hours;
            }
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            return days + "-" + indexOfMonth + "-" + year + " " + hours + ":" + minutes;
        }
        return days + "-" + indexOfMonth + "-" + year;   
    }
}