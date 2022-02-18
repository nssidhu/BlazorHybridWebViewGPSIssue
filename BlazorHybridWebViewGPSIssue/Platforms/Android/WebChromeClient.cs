using Android.Webkit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazorHybridWebViewGPSIssue.Platforms.Android
{
    //This needed for Getting permission for WebView only, if you are not using Web View this may not be needed at all
    public class MauiWebChromeClient : WebChromeClient
    {
        public override void OnPermissionRequest(PermissionRequest request)
        {
            request.Grant(request.GetResources());
        }
    }

}

