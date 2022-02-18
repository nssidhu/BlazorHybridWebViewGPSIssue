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

		builder.Services.AddBlazorWebView();
        //This is need for enabling webView GPD & Camera Permission.
        //If you are not using WebView or using webview but don't need acces to GPS & Camera, this may not be needed at all
        builder.ConfigureMauiHandlers(handlers =>
        {
            handlers.AddHandler<IBlazorWebView, MauiBlazorWebViewHandler>();
        });
        builder.Services.AddSingleton<WeatherForecastService>();

		return builder.Build();
	}
}
