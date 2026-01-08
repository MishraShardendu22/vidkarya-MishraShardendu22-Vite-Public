import { getJSONFromFirebase } from './firebaseUtil';

// Utility Functions

// Input: Array of Strings.
// Output: A single string containing all elements separated by commas.
function arrayToStr(arr) {
  if (arr === null || arr === undefined || arr.length === 0) return '';

  let str = '';

  for (let i = 0; i < arr.length; i++) {
    str += arr[i];

    if (i === arr.length - 1) {
      str += '.';
    } else {
      str += ', ';
    }
  }

  return str;
}

// Input: Array containing Users (as per schema)
// Output: Single String containing name of all member(users) separated by commas.
function userArrayToStr(arr) {
  if (arr.length === 0) return '0 Members on Vidkarya';

  let str = '';

  for (let i = 0; i < arr.length; i++) {
    str += arr[i].name;

    if (i === arr.length - 2) {
      str += ' & ';
    } else {
      str += ', ';
    }
  }

  return str + ' are Working.';
}

// Input [String] : Full Name of User
// Output [String] : First Name of User
function extractFirstName(fullName) {
  // Split the full name into an array of words
  const words = fullName?.trim().split(/\s+/);

  // The first word in the array is the first name
  const firstName = words[0];

  return firstName;
}

function isFilterEmpty(filter) {
  for (const key in filter) {
    if (filter[key].length > 0) return false;
  }

  return true;
}

// this function is to give time of upload
function convertTimeToMomentsAgo(timestamp) {
  const now = new Date();
  const uploadTime = new Date(timestamp);
  const timeDiff = now.getTime() - uploadTime.getTime();

  // Calculate the difference in days and hours
  const monthsDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30)); // 1 month
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // 24hrs
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // 60 mins

  if (monthsDiff > 0) {
    return `${monthsDiff} month${monthsDiff > 1 ? 's' : ''} ago`;
  } else if (daysDiff > 0) {
    return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
  } else {
    return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
  }
}

// Perform action on "Enter" Button Click
function handleEnterClick(event, sendRef) {
  if (event.key === 'Enter') {
    sendRef.current.click(); // Trigger button click
  }
}

// Returns [year, branch] extracted from email
function getYearAndBranch(email) {
  if (!email || !email.includes('iiitdwd.ac.in')) return [null, null];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // const currentMonth = currentDate.getMonth() + 1;

  const year = currentYear - parseInt('20' + email.slice(0, 2));
  // const semester = currentMonth <= 6 ? 2*(year) : 2*(year)+1;
  const branchCode = email.slice(2, 5).toUpperCase();

  const branchMap = {
    BCS: 'CSE',
    BEC: 'ECE',
    BDS: 'DSAI',
  };

  return [year, branchMap[branchCode]];
}

async function getTimeTableData(email) {
  try {
    const [year, branch] = getYearAndBranch(email);
    if (!year || !branch) return [];

    const timeTable1stYear = await getJSONFromFirebase('timetable/timetable1');
    const timeTable2ndYear = await getJSONFromFirebase('timetable/timetable2');
    const timeTable3rdYear = await getJSONFromFirebase('timetable/timetable3');
    const timeTable4thYear = await getJSONFromFirebase('timetable/timetable4');

    const branchIndexMap = {
      CSE: 0,
      ECE: 1,
      DSAI: 2,
    };

    const timeTables = {
      1: timeTable1stYear,
      2: timeTable2ndYear,
      3: timeTable3rdYear,
      4: timeTable4thYear,
    };

    const branchIndex = branchIndexMap[branch];

    if (year in timeTables && branchIndex !== undefined) {
      return timeTables[year][branchIndex] || [];
    }

    return [];
  } catch (error) {
    console.error('Failed to fetch timetable data:', error);
    return [];
  }
}

function convertToDate(dateString) {
  const dateObject = new Date(dateString);

  // Extract date components
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-indexed, so we add 1
  const day = dateObject.getDate();

  // Create a formatted date string
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return formattedDate;
}

function protectComponent(user, setShowLoginPopup) {
  if (!user) {
    window.history.back();
    setShowLoginPopup(true);
  } else return;
}

// Make first letter of a string capital
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  arrayToStr,
  protectComponent,
  userArrayToStr,
  extractFirstName,
  isFilterEmpty,
  convertTimeToMomentsAgo,
  handleEnterClick,
  getYearAndBranch,
  getTimeTableData,
  convertToDate,
};
