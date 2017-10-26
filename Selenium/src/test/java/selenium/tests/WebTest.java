package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;

public class WebTest
{
	private static WebDriver driver;

	@BeforeClass
	public static void setUp() throws Exception
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}

	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	@Test
	public void isValidMessageDisplayed() throws Exception
	{
		driver.get("https://se-bot-project.slack.com/");

		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		email.sendKeys(System.getenv("SLACK_EMAIL"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD"));

		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		driver.get("https://se-bot-project.slack.com/messages/android_recommender");
		wait.until(ExpectedConditions.titleContains("android_recommender"));

		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("UI");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		Thread.sleep(20000);

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		List<WebElement> msgs = driver.findElements(
				By.xpath("//span[@class='message_body']"));

		assertEquals(msgs.get(msgs.size() - 1).getText().contains("Recommendations"), true);
		WebElement menu = driver.findElement(By.id("team_menu"));
            menu.click();

            List<WebElement> signouts = driver.findElements(By.xpath("//a[@class='menu_list_link overflow_ellipsis']"));
            for (WebElement element : signouts){
                if(element.getText().contains("Sign out of "))
                    element.click();
            }

            assertNotNull(messageBot);
            driver.close();
            driver.quit();
	}

	@Test
	public void validMessageNotDisplayed() throws Exception
	{
		driver.get("https://se-bot-project.slack.com/");

		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		email.sendKeys(System.getenv("SLACK_EMAIL"));
		pw.sendKeys(System.getenv("SLACK_PASSWORD"));

		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		driver.get("https://se-bot-project.slack.com/messages/trial");
		wait.until(ExpectedConditions.titleContains("trial"));

		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);

		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("UI");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		Thread.sleep(10000);
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		List<WebElement> msgs = driver.findElements(
				By.xpath("//span[@class='message_body']"));

		assertEquals(msgs.get(msgs.size() - 1).getText().contains("NOt Recommendations"), true);

		WebElement menu = driver.findElement(By.id("team_menu"));
            menu.click();

            List<WebElement> signouts = driver.findElements(By.xpath("//a[@class='menu_list_link overflow_ellipsis']"));
            for (WebElement element : signouts){
                if(element.getText().contains("Sign out of "))
                    element.click();
            }

            assertNotNull(messageBot);
            driver.close();
            driver.quit();

	}

	public void isValidResponseDisplayed() throws Exception
	{
		driver = new ChromeDriver();
        driver.get("https://se-bot-project.slack.com/");
        WebDriverWait wait = new WebDriverWait(driver, 30);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

        WebElement email = driver.findElement(By.id("email"));
        WebElement pw = driver.findElement(By.id("password"));

        email.sendKeys(System.getenv("SLACK_EMAIL"));
        pw.sendKeys(System.getenv("SLACK_PASSWORD"));

        WebElement signin = driver.findElement(By.id("signin_btn"));
        signin.click();
           driver.get("https://se-bot-project.slack.com/messages/android_recommender");
            wait.until(ExpectedConditions.titleContains("android_recommender"));

           WebElement messageBot = driver.findElement(By.id("msg_input"));
            assertNotNull(messageBot);

           Actions actions = new Actions(driver);
            actions.moveToElement(messageBot);
            actions.click();
            actions.sendKeys("Please provide libraries");
            actions.sendKeys(Keys.RETURN);
            actions.build().perform();

           Thread.sleep(10000);

           wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

           List<WebElement> msgs = driver.findElements(
                    By.xpath("//span[@class='message_body']"));

           assertEquals(msgs.get(msgs.size() - 1).getText().contains("Which type of recommendations do you want"), true);

           actions = new Actions(driver);
            actions.moveToElement(messageBot);
            actions.click();
            actions.sendKeys("4");
            actions.sendKeys(Keys.RETURN);
            actions.build().perform();

           Thread.sleep(20000);

           wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

           List<WebElement> msgs1 = driver.findElements(
                    By.xpath("//span[@class='message_body']"));

           assertEquals(msgs1.get(msgs1.size()-1).getText().contains("ERROR: No recommendations found! Please verify if the repository contains Android code"), true);

            WebElement menu = driver.findElement(By.id("team_menu"));
            menu.click();

            List<WebElement> signouts = driver.findElements(By.xpath("//a[@class='menu_list_link overflow_ellipsis']"));
            for (WebElement element : signouts){
                if(element.getText().contains("Sign out of "))
                    element.click();
            }

            assertNotNull(messageBot);
            driver.close();
            driver.quit();
	}
}
