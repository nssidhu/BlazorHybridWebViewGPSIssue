using Microsoft.AspNetCore.Components.WebView.Maui;
using BlazorHybridWebViewGPSIssue.Data;
using BlazorHybridWebViewGPSIssue.Platforms.Android;

namespace BlazorHybridWebViewGPSIssue;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();

		builder
			.RegisterBlazorMauiWebView()
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
			});

		

		//This is need for enabling webView GPD & Camera Permission.
		//If you are not using WebView or using webview but don't need acces to GPS & Camera, this may not be needed at all
		builder.ConfigureMauiHandlers(handlers =>
		{
			handlers.AddHandler<IBlazorWebView, MauiBlazorWebViewHandler>();

			// Gerald: This was added
			BlazorWebViewHandler.BlazorWebViewMapper.AppendToMapping("EnableGeoLocation", (handler, webview) =>
			{
				handler.NativeView.Settings.SetGeolocationEnabled(true);
				handler.NativeView.Settings.JavaScriptEnabled = true;
				handler.NativeView.Settings.AllowFileAccess = true;
				//handler.NativeView.Settings.AllowFileAccessFromFileURLs = true;
				//handler.NativeView.Settings.AllowContentAccess = true;
				//handler.NativeView.Settings.BlockNetworkImage = false;
				//handler.NativeView.Settings.AllowUniversalAccessFromFileURLs = true;
				//handler.NativeView.Settings.DomStorageEnabled = true;
		     	handler.NativeView.Settings.SetGeolocationEnabled(true);
				handler.NativeView.Settings.SetGeolocationDatabasePath(handler.NativeView.Context.FilesDir.Path);


			});

		});

		builder.Services.AddBlazorWebView();

		builder.Services.AddSingleton<WeatherForecastService>();

		return builder.Build();
	}
}
