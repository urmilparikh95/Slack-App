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
		
		driver.get("https://se-bot-project.slack.com/messages/trial");
		wait.until(ExpectedConditions.titleContains("trial"));

		WebElement messageBot = driver.findElement(By.id("msg_input"));
		assertNotNull(messageBot);
		
		Actions actions = new Actions(driver);
		actions.moveToElement(messageBot);
		actions.click();
		actions.sendKeys("hello android recommender");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'hello android recommender']"));
		assertNotNull(msg);
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
		actions.sendKeys("hello android recommender");
		actions.sendKeys(Keys.RETURN);
		actions.build().perform();

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'xyz']"));
		assertNull(msg);
	}
}
