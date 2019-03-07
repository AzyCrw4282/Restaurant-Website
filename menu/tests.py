from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import NoAlertPresentException
import unittest, time, re


class welcome_menu_TestCase(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_welcome_menu_test_case(self):
        driver = self.driver
        driver.get("http://localhost:8000/menu/")
        driver.find_element_by_id("table_code").click()
        driver.find_element_by_id("table_code").clear()
        driver.find_element_by_id("table_code").send_keys("1234")
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='Welcome To Oaxaca'])[1]/following::button[1]").click()

        driver.get("http://localhost:8000/menu/table_order/3ec4d89c-ff32-45d4-bcee-b2862d970e86/")
        driver.find_element_by_id("1comment").click()
        driver.find_element_by_id("1comment").clear()
        driver.find_element_by_id("1comment").send_keys("extra chilliiiiiiiiiiii")
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
        driver.find_element_by_id("submit_order").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException as e:
            return False
        return True

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

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)

"""

class Ordering(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()
        self.driver.implicitly_wait(30)
        self.base_url = "https://www.katalon.com/"
        self.verificationErrors = []
        self.accept_next_alert = True

    def test_ordering(self):
        driver = self.driver
        driver.get("http://localhost:8000/menu/table_order/3ec4d89c-ff32-45d4-bcee-b2862d970e86/")
        driver.find_element_by_id("1comment").click()
        driver.find_element_by_id("1comment").clear()
        driver.find_element_by_id("1comment").send_keys("extra chilli")
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
        driver.find_element_by_xpath(
            "(.//*[normalize-space(text()) and normalize-space(.)='delete'])[1]/following::button[1]").click()
        driver.find_element_by_id("submit_order").click()

    def is_element_present(self, how, what):
        try:
            self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e:
            return False
        return True

    def is_alert_present(self):
        try:
            self.driver.switch_to_alert()
        except NoAlertPresentException as e:
            return False
        return True

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

    def tearDown(self):
        self.driver.quit()
        self.assertEqual([], self.verificationErrors)


if __name__ == "__main__":
    unittest.main()


"""""