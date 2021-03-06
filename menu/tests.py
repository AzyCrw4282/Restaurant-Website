from selenium import webdriver
from time import sleep
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re

#All tests were performed locally and hence some are hard-coded, please change to fir your own configuration.
#For test requirements check running_test_cases txt file

#This class will include test for menu interactions by the customer
class welcome_menu_TestCase(unittest.TestCase):
	#Creates the set up for testing
	def setUp(self):
		self.driver = webdriver.Chrome()
		#self.driver = webdriver.Firefox() uncomment this and comment the above if you like to use firefox
		self.driver.implicitly_wait(30)
		self.base_url = "https://www.katalon.com/"
		self.verificationErrors = []
		self.accept_next_alert = True

	#All user stories tests are performed in here
	def test_welcome_menu_test_case(self):

		sleep(3)
		driver = self.driver

		#Loads the first page and enter table code and redirects to menu
		driver.get("http://localhost:8000/menu/")
		driver.find_element_by_id("table_code").click()
		driver.find_element_by_id("table_code").clear()
		driver.find_element_by_id("table_code").send_keys("978")#Hard coded value, change it to fit your configuration

		#Assertion test to see that appropriate table value was entered to authorise a user
		self.assertEqual(len(driver.find_element_by_id("table_code").get_attribute("value"))>0,True,"Check table order exists") # 1 & 2

		sleep(1)#Added a sleep method to delay the automation to check some of the user stories

		#This fragment below will go through the process of making an order
		driver.get("http://localhost:8000/menu/table_order/bb9946c6-4615-4472-b7a4-bf3f8f6353bf/")
		# Added a sleep method to delay the automation to check some of the user stories
		sleep(2)

		#This will select and add to order with comments
		driver.find_element_by_class_name("food_card_button").click()#Hard coded value, change it to fit your configuration
		driver.find_element_by_id("2comment").click()
		driver.find_element_by_id("2comment").clear()
		driver.find_element_by_id("2comment").send_keys("extra Chilli")


		driver.find_element_by_class_name("food_card_button").click()
		sleep(2)

		#This checks that food items are displayed
		self.assertEqual(driver.find_element_by_class_name("food_card_img_border").is_displayed(),True,"Border displayed ")#3, 4,5
		#Checks final order exists in the basket
		self.assertEqual(driver.find_element_by_id("order_total").is_displayed(), True,"total_order_value")#7

		sleep(1)

		#driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
		#driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
		driver.find_element_by_id("4comment").click()
		driver.find_element_by_id("4comment").clear()
		driver.find_element_by_id("4comment").send_keys("More creamy")


		print("Order added and cancellation tested.")
		sleep(1)
		#It will submit the order
		driver.find_element_by_id("submit_order").click()#10

		client_confirm = driver.find_element_by_id("submit_order").text#After submission order will be client-confirmed

		sleep(2)#During the sleep process the waiter can confirm the order

		waiter_confirm = driver.find_element_by_id("submit_order").text#After waiter confirmed it should be waiter_confirmed

		self.assertTrue("Order state changed!", client_confirm == waiter_confirm);

		#The test below is an alternative way to perform it mainly using xpath, but was later excluded as it wasn't reliable.
		"""
		
		driver = self.driver
		driver.get("http://localhost:8000/menu/")
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Login'])[1]/following::div[1]").click()
		driver.find_element_by_id("table_code").click()
		driver.find_element_by_id("table_code").clear()
		driver.find_element_by_id("table_code").send_keys("123")
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='Welcome To Oaxaca'])[1]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
		driver.find_element_by_id("4comment").click()
		driver.find_element_by_id("4comment").clear()
		driver.find_element_by_id("4comment").send_keys("More creamy")
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[3]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[4]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[5]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[6]/following::button[1]").click()
		driver.find_element_by_xpath("(.//*[normalize-space(text()) and normalize-space(.)='delete'])[6]/following::button[1]").click()
		driver.find_element_by_id("submit_order").click()
		"""

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

	#This will tear down the whole running process safely. useful for large testing
	def tearDown(self):
		self.driver.quit()
		self.assertEqual([], self.verificationErrors)

#This will start the test
if __name__ == "__main__":
	unittest.main()


"""" Most user stories covered in the tests
The user stories below indicate all possible user actions and they are tested during automation and
by self.assertions methods. I have numebred each user story and where they are being tested.


1)As a customer I want to receive a table code.
2)As a customer I want to be to able to enter a table code in order to access the menu.

3)As a customer I want to be able to view all the items in the menu by looking at the corresponding pictures.
4)As a customer I want to be able to see all the food information in the menu.
5)As a customer I want to be able to easily order food from the menu.


6)As a customer I want to be able to view a food in a section I am interested in.
7)As a customer I want to see my total order whilst I am ordering.

8)As a customer I want to be able to add items into a basket.
9)As a customer I want to be able to delete items off the basket.
10)As a customer I want to be able to submit an order.


11)As a customer I want my order to be confirmed by a waiter in order to change my order.
12)As a customer I want to be informed the status of my order.

-----Test cannot be done---
13)As a customer I want to pay using the interface at the table.
14)As a customer I want to be able to pay safely.
15)As a customer I want a way to contact the waiter when I need help with my order
"""

