from time import sleep
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

#All tests were performed locally and hence some are hard-coded, please change to fir your own configuration.
#For test requirements check running_test_cases txt file


#Test below will cover msot chef interactions
class ChefNewOne(unittest.TestCase):

    #This is the set-up code which adds a google chrome driver
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True


    #Before running the test please ensure that waiter confirmed the order
    #This is the main test phase for chef in which it will login and deal with order cards
    def test_chef_new_one(self):
        driver = self.driver

        driver.get("http://localhost:8000/accounts/login/")

        driver.find_element_by_id("id_username").click()
        driver.find_element_by_id("id_username").clear()
        driver.find_element_by_id("id_username").send_keys("azky123")#Hard coded value, change it to fit your configuration
        driver.find_element_by_id("id_password").click()
        driver.find_element_by_id("id_password").clear()
        driver.find_element_by_id("id_password").send_keys("azky123")#Hard coded value, change it to fit your configuration
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Welcome'])[1]/following::form[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Password:'])[1]/following::button[1]").click()

        driver.get("http://localhost:8000/chef/")
        driver.find_element_by_id("card_container").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Cancel'])[1]/following::button[1]").click()
        sleep(2)

    #Error handling to see if a given element exists on the page
    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    #If alert prompt used then this would handle it
    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException as e:
            return False
        return True

    #To handle any alert intractions in the test
    def close_alert_and_get_its_text(self):
        try:
            alert = self.driver.switch_to_alert()
            alert_text = alert.text
            if self.accept_next_alert:
                alert.accept()
            else:
                alert.dismiss()
            return alert_text
        finally:
            self.accept_next_alert = True

#This will start the test
if __name__ == "__main__":
    unittest.main()


""" User stories that were covered in the test


As a kitchen Staff I want to receive a notification to know when the customer has ordered so I can start preparing the food.
As a kitchen Staff I want to be able to send a notification to the waiters when the order is ready so it can be given to the customer.

"""


