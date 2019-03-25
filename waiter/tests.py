
from selenium import webdriver
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re
from selenium.webdriver.common.action_chains import ActionChains

#All tests were performed locally and hence some are hard-coded, please change to fir your own configuration.
#For test requirements check running_test_cases txt file


#Test below will include all waiter interactions
class WaiterTests(unittest.TestCase):

	#Creates the set up for testing
	def setUp(self):
		self.driver = webdriver.Chrome()
		# self.driver = webdriver.Firefox() uncomment this and comment the above if you like to use firefox
		self.driver.implicitly_wait(30)
		self.base_url = "https://www.katalon.com/"
		self.verificationErrors = []
		self.accept_next_alert = True

	#All user stories tests are performed in here
	def test_waiter_tests(self):
		#Test below automates how the order will be handled by the waiter and chef
		driver = self.driver
		driver.get("http://localhost:8000/accounts/login/")
		sleep(3)

		#This will authorise the waiter to login
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

		#sleeps to slow down the exectuion and lets user go to insertion page to add stuffs, e.g. add table, food, etc.
		sleep(2)
		driver.get("http://localhost:8000/waiter/insert_stuff/")
		driver.find_element_by_id("table_id").click()
		driver.find_element_by_id("table_id").click()
		driver.find_element_by_id("table_id").clear()
		driver.find_element_by_id("table_id").send_keys("123")#Hard coded value, change it to fit your configuration
		driver.find_element_by_id("table_number").click()
		driver.find_element_by_id("table_number").clear()
		driver.find_element_by_id("table_number").send_keys("123")#Hard coded value, change it to fit your configuration
		driver.find_element_by_xpath(
			"(.//*[normalize-space(text()) and normalize-space(.)='Add Information'])[1]/following::button[1]").click()
		sleep(5)

		#Returns to waiter page and selects available cards
		driver.get("http://localhost:8000/waiter/")
		driver.find_element_by_id("tab_link_client_confirmed").click()
		sleep(2)
		#river.find_element_by_link_text("Table: 123").click()
		driver.find_element_by_partial_link_text("Table: 123").click()#Hard coded value, change it to fit your configuration
		sleep(2)

		#This will hover over the button to show the availbale options
		driver.implicitly_wait(3)
		element_to_hover_over = driver.find_element_by_class_name("override_button")
		hover = ActionChains(driver).move_to_element(element_to_hover_over)
		hover.perform()

		#This can confirm an order to the next stage
		sleep(3)
		driver.find_element_by_link_text("Confirm").click()
		#Once waiter accepts an order we then go to the chef view to accept/reject the order so waiter can handle the rest
		sleep(2)
		driver.find_element_by_id("tab_link_waiter_confirmed").click()
		driver.find_element_by_partial_link_text("Table: 123").click()

		#Into chef operations; selects a card and approves it.
		sleep(2)
		driver.get("http://localhost:8000/chef/")
		sleep(2)
		driver.find_element_by_id("card_container").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Table Number: 123'])[1]/following::div[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Cancel'])[1]/following::button[1]").click()

		#Once cooked waiter can change state of order, e.g. chef_confirmed to Delivered.
		sleep(2)

		driver.get("http://localhost:8000/waiter/")
		driver.find_element_by_id("tab_link_chef_confirmed").click()
		driver.find_element_by_partial_link_text("Table: 123").click()#Using partial link to traget certain text since id's are dynamic

		element_to_hover_over = driver.find_element_by_class_name("override_button")
		hover = ActionChains(driver).move_to_element(element_to_hover_over)
		hover.perform()

		sleep(2)

		#After order served waiter selects it's delivered.
		driver.find_element_by_link_text("Delivered").click() #This will deliver the food

		sleep(2)

	# Error handling to see if a given element exists on the page
	def is_element_present(self, how, what):
		try:
			self.driver.find_element(by=how, value=what)
		except NoSuchElementException as e:
			return False
		return True

	# If alert prompt used then this would handle it
	def is_alert_present(self):
		try:
			self.driver.switch_to_alert()
		except NoAlertPresentException as e:
			return False
		return True

	# To handle any alert intractions in the test
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

	# This will tear down the whole running process safely. useful for large testing
	def tearDown(self):
		self.driver.quit()
		self.assertEqual([], self.verificationErrors)

#This will start the test
if __name__ == "__main__":
	unittest.main()



""" Most user stories below were tested above and some weren't as they were only partially implemented.

1.As a waiter I want to give customers a table number so that they are verified. Y

2.As a waiter I want to have access to the tables which an order needs to be confirmed so I can pick a table to serve. y

3.As a waiter I want to receive a notification when the customer needs me so I can help them.

4.As a waiter I want to select which table to confirm their order from a list of all the ready tables. y

5.As a waiter I want to only work on one table at a time. y
6.As a waiter I want to keep my table informed with the status of the order. y
7.As a waiter I want to give the customer their order when it is ready. 

8.As a waiter I want to be able to change the status after I deliver the food. y
9.As a waiter I want to be informed by the kitchen staff the status of the order.
10.As a waiter I want to get a notification to collect the order from the kitchen staff to deliver the order.
11.As a waiter I want to have access to the menu in order to only show customers available dishes.
12.As a waiter I want to be able to cancel orders in order to inform the kitchen staff when the customer changes an order.

"""















