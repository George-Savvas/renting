import React from 'react'
import api from '../../Interface.js'
import UserEntry from './UserEntry.js'
import './AdminHome.css'

/*******************************************************
 * The amount of users that are displayed in each page *
 *******************************************************/
const numOfUsersPerPage = 10

/***********************************************************************
 * Given the population number of a collection of items and the items  *
 *  that can be displayed in a single page, this function returns the  *
 * amount of needed pages to represent all the items of the collection *
 ***********************************************************************/
function getAmountOfNeededPages(itemsNum, itemsPerPage)
{
    /* The last page may not have 'itemsPerPage' items. If the last
     * page has not 'itemsPerPage' items, then the remainder of the
     * division 'itemsNum'/'itemsPerPage' is not zero. In this case
     * we return the quotient plus one for the non-full page.
     */
    const quotient = Math.floor(itemsNum / itemsPerPage)
    const remainder = itemsNum % itemsPerPage

    if(remainder !== 0)
        return quotient + 1

    return quotient
}

/**************************************************************
 * Returns an array with all the registered users of the site *
 **************************************************************/
async function getAllUsers()
{
    let users;

    await fetch(`${api}/auth/getAllUsers`)
        .then((res) => res.json())
        .then((data) => {users = data.users})

    return users;
}

/****************************
 * The Admin Home Component *
 ****************************/
export default function AdminHome({admin})
{
    /* We create a state with the array of all the registered users */
    const [users, setUsers] = React.useState([])

    /* We create a state with the first, the current and the last page of displayed users */
    const [pageTrio, setPageTrio] = React.useState({first: 1, current: 1, last: 1})

    /* With the following effect we fetch all the registered users from the backend
     * server with the help of 'fetchUsers'. After we retrieve the users we also
     * declare the values of the first, the current and the last page of users.
     */
    React.useEffect(() => {

        /* Fetches all the users that are registered in the site from the backend server.
         * Then according to the total amount of users, the function decides how many pages
         * we need to represent all the users.
         */
        async function fetchUsers() {
            setUsers(await getAllUsers())
            setPageTrio({
                first: 1,
                current: 1,
                last: getAmountOfNeededPages(users.length, numOfUsersPerPage)
            })
        }

        fetchUsers()

    }, [users.length])

    /* A function that navigates the administrator to the first page of users */
    function goToFirstPage()
    {
        /* If we are already in the first page, there is nothing to do */
        if(pageTrio.current === pageTrio.first)
            return

        /* Else we change the state of the page trio so as it represents the first page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: pageTrio.first}
        })
    }

    /* A function that navigates the administrator to the last page of users */
    function goToLastPage()
    {
        /* If we are already in the last page, there is nothing to do */
        if(pageTrio.current === pageTrio.last)
            return

        /* Else we change the state of the page trio so as it represents the last page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: pageTrio.last}
        })
    }

    /* A function that navigates the administrator to the next page of users */
    function goToNextPage()
    {
        /* If we are in the last page, there is nothing to do */
        if(pageTrio.current === pageTrio.last)
            return

        /* Else we change the state of the page trio so as it represents the next page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: currentPageTrio.current + 1}
        })
    }

    /* A function that navigates the administrator to the previous page of users */
    function goToPreviousPage()
    {
        /* If we are in the first page, there is nothing to do */
        if(pageTrio.current === pageTrio.first)
            return

        /* Else we change the state of the page trio so as it represents the previous page */
        setPageTrio(currentPageTrio => {
            return {...currentPageTrio, current: currentPageTrio.current - 1}
        })
    }

    /* A function that navigates the administrator to an event-specified page of users */
    function goToSpecifiedPage(event)
    {
        /* The specified page where the user wants to go comes from an "onChange" event */
        const specifiedPage = Number(event.target.value)

        /* We change the state of the page trio so as it represents the specified page */
        setPageTrio(currentPageTrio => {
            return {
                ...currentPageTrio,
                current: (specifiedPage >= currentPageTrio.first && specifiedPage <= currentPageTrio.last) ? specifiedPage : currentPageTrio.current
            }
        })
    }

    /* A callback function used to call 'goToSpecifiedPage' */
    const goToSpecifiedPageCallback = (event) => {goToSpecifiedPage(event)}

    /* We create the DOM table of the users. The home page of the
     * admin will render the whole array of all the registered users.
     */
    const domUsers = users.map(user => {
        return (
            <UserEntry
                key={user.username}
                user={user}
            />
        )
    })

    /* We only want to display the users of the current page. We filter those users
     * from the array with all the users with the help of the 'slice' method.
     */
    const domUsersOfCurrentPage = domUsers.slice((pageTrio.current - 1) * numOfUsersPerPage,
        (pageTrio.current * numOfUsersPerPage < domUsers.length) ? pageTrio.current * numOfUsersPerPage : undefined)

    /* We return the final dom elements of the admin's home page */
    return (
        <div className="admin-home">
            <div className="admin-home-title">
                Registered users of the site
            </div>
            <div className="admin-home-users">
                {domUsersOfCurrentPage}
            </div>
            <div className="admin-home-page-management">
                <div className="admin-home-page-management-current-page-num">
                    <div className="admin-home-page-management-current-page-num-context">Page</div>
                    <div className="admin-home-page-management-current-page-num-value">{pageTrio.current}</div>
                    <div className="admin-home-page-management-current-page-num-context">of</div>
                    <div className="admin-home-page-management-current-page-num-value">{pageTrio.last}</div>
                </div>
                <button
                    className={(pageTrio.current !== pageTrio.first) ?
                        "admin-home-page-management-button" :
                        "admin-home-page-management-disabled-button"
                    }
                    onClick={goToFirstPage}
                >
                    First
                </button>
                <button
                    className={(pageTrio.current !== pageTrio.first) ?
                        "admin-home-page-management-button" :
                        "admin-home-page-management-disabled-button"
                    }
                    onClick={goToPreviousPage}
                >
                    Prev
                </button>
                <button
                    className={(pageTrio.current !== pageTrio.last) ?
                        "admin-home-page-management-button" :
                        "admin-home-page-management-disabled-button"
                    }
                    onClick={goToNextPage}
                >
                    Next
                </button>
                <button
                    className={(pageTrio.current !== pageTrio.last) ?
                        "admin-home-page-management-button" :
                        "admin-home-page-management-disabled-button"
                    }
                    onClick={goToLastPage}
                >
                    Last
                </button>
                <div className="admin-home-page-management-goto-page">
                    <div className="admin-home-page-management-goto-page-title">
                        Go to page:
                    </div>
                    <div
                        className={(pageTrio.current !== pageTrio.first) ?
                            "admin-home-page-management-goto-page-altering-box" :
                            "admin-home-page-management-goto-page-altering-box-disabled"
                        }
                        onClick={goToPreviousPage}
                    >
                        -
                    </div>
                    <input
                        className="admin-home-page-management-goto-page-input-box"
                        style={{color: ((pageTrio.current < pageTrio.first) || (pageTrio.current > pageTrio.last)) ? "red" : "black"}}
                        type="text"
                        name="current"
                        value={pageTrio.current}
                        onChange={goToSpecifiedPageCallback}
                    />
                    <div
                        className={(pageTrio.current !== pageTrio.last) ?
                            "admin-home-page-management-goto-page-altering-box" :
                            "admin-home-page-management-goto-page-altering-box-disabled"
                        }
                        onClick={goToNextPage}
                    >
                        +
                    </div>
                </div>
            </div>
        </div>
    )
}
