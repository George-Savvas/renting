/****************************************************
 * Necessary imports to read/write/append to a file *
 ****************************************************/
const fs = require('fs')

/****************************************************
 * Attempts to read the file in the designated path *
 *  with 'utf-8' encoding and return its contents   *
 ****************************************************/
const read = (path) => {

    /* We attempt to read the file in a synchronous manner
     *
     * Case the reading is successful: We return the contents
     * of the file
     */
    try {
        const fileData = fs.readFileSync(path, 'utf-8')
        return fileData
    }

    /* Case the reading is not successful: We print the error */
    catch(error) {
        console.log(error)
    }

    /* We return the string below in case of unsucessful reading */
    return "Error: the file could not be read"
}

/***************************************************************
 * Attempts to write the content of the variable 'toBeWritten' *
 *             in the file in the designated path              *
 ***************************************************************/
const write = (path, toBeWritten) => {

    /* We attempt to write in the file in a synchronous manner
     *
     * Case the writing is successful: The contents of the target
     * file should change
     */
    try {
        fs.writeFileSync(path, toBeWritten)
    }

    /* Case the writing is not successful: We print the error */
    catch(error) {
        console.log(error)
    }
}

/*****************************************************************
 * Attempts to append the content of the variable 'toBeAppended' *
 *              to the file in the designated path               *
 *****************************************************************/
const append = (path, toBeAppended) => {

    /* We attempt to append to the file in a synchronous manner
     *
     * Case the appending is successful: The contents of the target
     * file should change
     */
    try {
        fs.appendFileSync(path, toBeAppended)
    }

    /* Case the appending is not successful: We print the error */
    catch(error) {
        console.log(error)
    }
}

/*******************************************************************
 * We export the 'read' function above with the custom name 'read' *
 *******************************************************************/
const _read = read
export { _read as read }

/*********************************************************************
 * We export the 'write' function above with the custom name 'write' *
 *********************************************************************/
const _write = write
export { _write as write }

/***********************************************************************
 * We export the 'append' function above with the custom name 'append' *
 ***********************************************************************/
const _append = append
export { _append as append }
