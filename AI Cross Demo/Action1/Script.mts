'ONE TEST : Advantage online shopping login and logoff 
'based on AI
'Supported env: Desktop Chrome and Firefox, iOS, Android, and mobile web (15.0.1)
'	This connects to demo.mobilecenter.io, you must put in your credentials into Tools | Options
'	Make sure your desktop is set to 100% scaling.  Not 100% scaling can break the AI computer vision

Function FutureEnhancements
'Future enhancements:
'	1) Add other business processes (e.g. product search, add to cart, clear cart, checkout)
'	2) Add Edge as an environment
'	3) Setup concurrent runs
	
End Function

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Launching env
Function LaunchEnvironment
		Set dt=DataTable
		Select Case 	dt.Value("Context")
			Case "Browser"
			
				While Browser("CreationTime:=0").Exist(0)   
					Browser("CreationTime:=0").Close 
				Wend
				SystemUtil.Run dt.Value("Browser") & ".exe" ,"","","",3
				Set LaunchEnvironment=Browser("CreationTime:=0")
				LaunchEnvironment.ClearCache
				LaunchEnvironment.Navigate dt.value("URL")
				LaunchEnvironment.Sync
				wait(2)
				LaunchEnvironment.Maximize
				
			Case "Device"	
				Set oDevice=Device("Class Name:=Device","ostype:=" & dt.value("ostype") ,"id:=" & dt.value("device_id"))
				Set oApp=oDevice.App("Class Name:=App","identifier:=" & dt.value("app_identifier") ,"instrumented:=" & dt.value("app_instrumented"))		
				Set	LaunchEnvironment=oDevice
				oApp.Launch Install, Restart
'				oApp.Launch DoNotInstall, Restart
				
				
				'=================================================================================
				'Need help here
'				
'				If dt.Value("app_identifier") = "MC.Browser" Then
'					oApp.Navigate dt.value("URL")
'					oApp.Sync
'				End If
				'=================================================================================
				
				
				
		End Select
End Function

Function Login
	'========================================================================================================================
	'	Login
	'If mobile web, navigate to the URL
		If DataTable.Value("app_identifier") = "MC.Browser" Then
			AIUtil("text_box", "aboutzblank").Type "advantageonlineshopping.com/"
			AIUtil.FindTextBlock("advantageonlineshopping.com").Click
			AIUtil.FindTextBlock("SPEAKERS").Exist(10)
		End If
	
	'Click the hamburger if it exists
	'# Feature AIUtil SDK Usage
		if  AIUtil("hamburger_menu").exist(0) then AIUtil("hamburger_menu").Click
	'Click the profile  icon
	'# Feature Spy with AI enhancements'
		'AIUtil("profile").Highlight
		AIUtil("profile").Click
	'# Feature AI Inspect on Desktop Browsers
	'Set 'aidemo' into 'username' field 
		AIUtil("input", "Username").Highlight
		AIUtil("input", "Username").Type "aidemo"
		'AIUtil("input", "Username").Click			'If not https, Firefox throws a warning.
	'Set 'AIdemo1' into 'password' field
		AIUtil("input", "Password").Type "AIdemo1"
	'Click the login button
		AIUtil("button", "SIGN IN").Click
	
	'Wait for the shopping cart button to show, doesn't show on screen for mobile web, sync on SPEAKERS text instead for mobile web
		If DataTable.Value("app_identifier") = "MC.Browser" Then
			AIUtil.FindTextBlock("SPEAKERS").Exist(10)
		Else
			AIUtil("shopping_cart").Exist(10)
		End If
	
End Function

Function Logout
	Set dt=DataTable
	Set oDevice=Device("Class Name:=Device","ostype:=" & dt.value("ostype") ,"id:=" & dt.value("device_id"))
				
	'========================================================================================================================
	'	Logout
	'# Feature AIUtil SDK Usage
		if  AIUtil("hamburger_menu").exist(0) then AIUtil("hamburger_menu").Click
	'Click the profile  icon
	'# Feature Spy with AI enhancements'
		AIUtil("profile").Click
	'Business process differs between desktop and mobile
		If DataTable.Value("app_identifier") = "MC.Browser" Then
			AIUtil.FindTextBlock("Sign out").Click
		Else
			Select Case DataTable.Value("Context")
				Case "Browser"
					AIUtil.FindTextBlock("Sign out").Click
				Case "Device"	
					If DataTable.value("ostype") = "IOS" Then
		'				IOS version of the app draws a box around the button, Android does not.  Additionally, the OCR is seeing the text different per OS, submitted feedback.
						AIUtil("button", "Ye S").Click
					Else
		'				Android
						AIUtil.FindTextBlock("YES").Click
					End If
			End Select
		End If
		
	If  AIUtil("hamburger_menu").exist(0) then 
		oDevice.CloseViewer
	Else
		Browser("CreationTime:=0").Close
	End  If
	
End Function
	
	set oContext=LaunchEnvironment
	AIUtil.SetContext oContext 	
	Login
	Logout
	
