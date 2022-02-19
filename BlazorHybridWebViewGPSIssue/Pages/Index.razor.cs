using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Essentials;
using Microsoft.Maui.Controls.Xaml;
using Microsoft.Maui;
using Microsoft.Maui.Controls;
using GoogleMapClassLibrary;

namespace BlazorHybridWebViewGPSIssue.Pages
{
    public partial class Index
    {

        private string erMessage = "";

        GoogleMapClassLibrary.GoogleMap MapRef;
        bool GetingLocation = false;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
           
            await base.OnAfterRenderAsync(firstRender);
            return;
        }
      
         private void GPSLocationRecieved(MapLocation lc)
        {
            MapRef.ShowCurrentPosition(lc.Latitude, lc.Longitude);
        }
    }

}
