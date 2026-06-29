Feature: Default

  Scenario: User logs in and visit another page
    Given user is logged in
    When the user visits another page
    Then the page is displayed
