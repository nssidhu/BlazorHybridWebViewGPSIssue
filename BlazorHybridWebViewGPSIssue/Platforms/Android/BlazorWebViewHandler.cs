using Android.Webkit;
using Microsoft.AspNetCore.Components.WebView.Maui;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebViewGPSIssue.Platforms.Android
{
    //This is needed for WebView only, if you are not using Webview than this may not be needed at all
    public class MauiBlazorWebViewHandler : BlazorWebViewHandler
    {
        protected override WebChromeClient GetWebChromeClient()
        {
            return new MauiWebChromeClient();
        }
    }
}
