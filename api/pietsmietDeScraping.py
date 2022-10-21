from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from functools import partial
from flask import *
from flask_cors import CORS
import json
import time
import sqlite3 as sl

app = Flask(__name__)
CORS(app)
drivers = []

con = sl.connect("my.db", check_same_thread=False)
with con:
    con.execute("""
        CREATE TABLE IF NOT EXISTS PIETSMIET (
            title TEXT PRIMARY KEY,
            description TEXT,
            link TEXT
        );
    """)

@app.route('/api/scrapeVideos', methods=['GET'])
def api():
    reacts = []

    options = Options()
    options.headless = True
    driver = webdriver.Chrome(service=Service(
        ChromeDriverManager().install()))
    driver.get("https://www.pietsmiet.de/community/suggestions")
    time.sleep(1)
    wait = WebDriverWait(driver, 10)
    wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//*[@id=\"qc-cmp2-ui\"]/div[2]/div/button[2]"))).click()

    # while (True):
    #     try:
    suggestions = driver.find_elements(
        By.XPATH, "//div[@class='flex-grow border-l-0 lg:border-l border-gray-200']")
    for suggestion in suggestions:
        if "React" in suggestion.text and "https" in suggestion.text:
            # print(suggestion.text)
            reacts.append(suggestion.text)
    wait = WebDriverWait(driver, 20)
    element = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//a[@aria-label='Next']"))).click()
    time.sleep(2)
    # except:
    #     break

    reactsJson = []
    reactsSQL = []

    for react in reacts:
        title = react.split("\n")[0]
        description = react.split("\n")[1]
        link = react.split("\n")[2]
        reactsJson.append({
            "title": title,
            "description":  description,
            "url":  link
        })
        reactsSQL.append(
            (title, description, link))

    sql = f"INSERT OR IGNORE INTO PIETSMIET (title, description, link) VALUES (?, ?, ?)"
    with con:
        con.executemany(sql, reactsSQL)

    driver.quit()
    return {"status": 200, "data": reactsJson}


@app.route('/api/getVideos', methods=['GET'])
def getVideos():
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM PIETSMIET")
        rows = cur.fetchall()

    reactsJson = []
    for row in rows:
        reactsJson.append({
            "title": row[0],
            "description":  row[1],
            "url":  row[2]
        })
    return {"status": 200, "data": reactsJson}


if __name__ == '__main__':
    app.run(debug=True, port=3001)
