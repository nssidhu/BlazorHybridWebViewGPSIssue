using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Maui.Essentials;
using Microsoft.Maui.Controls.Xaml;
using Microsoft.Maui;
using Microsoft.Maui.Controls;

namespace BlazorHybridWebViewGPSIssue.Pages
{
    public partial class Index
    {

        private string erMessage = "";

        GoogleMapClassLibrary.GoogleMap MapRef;
        bool GetingLocation = false;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if(firstRender)
            {
               
               // await GetLocation();
            }
            await base.OnAfterRenderAsync(firstRender);
            return;
        }
        private async Task GetLocation()
        {
            try
            {
                GetingLocation = true;
                StateHasChanged();
                //https://www.youtube.com/watch?app=desktop&v=qAQZuIBxwvw
                //https://docs.microsoft.com/en-us/xamarin/essentials/geolocation?tabs=android


                var request = new GeolocationRequest(GeolocationAccuracy.Best);
                //var location = await Geolocation.GetLocationAsync(request);

                var location = await Geolocation.GetLocationAsync(request);


                if (location.IsFromMockProvider)
                {
                    erMessage = "Mock Location" + Environment.NewLine;
                }
                else
                {
                    erMessage = "Real Location : " + Environment.NewLine;
                }
                if (location != null)
                {

                    await MapRef.ShowCurrentPosition(location.Latitude, location.Longitude);
                     var msg = $"Latitude: {location.Latitude}, Longitude: {location.Longitude}, Altitude: {location.Altitude}";

                    Console.WriteLine(msg);
                    erMessage += location.ToString();
                }
                else
                {
                    erMessage += "Location is Null";
                }
            }
            catch (FeatureNotSupportedException fnsEx)
            {
                // Handle not supported on device exception
                erMessage += "Location is Not Supported";
            }
            catch (FeatureNotEnabledException fneEx)
            {
                erMessage += "Location is Not Enabled on this Device";
                StateHasChanged();
                AppInfo.ShowSettingsUI();
                //GetLocationAsync();
                // Handle not enabled on device exception

            }
            catch (PermissionException pEx)
            {
                // Handle permission exception
                erMessage += "Location is Permission Denied";
            }
            catch (Exception ex)
            {
                await Permissions.RequestAsync<Permissions.LocationWhenInUse>();
                // Unable to get location
                erMessage += "Error Getting Lcoation";
            }
            finally
            {
                //isDisabled = false;
                GetingLocation = false;
            }
            StateHasChanged();
        }
    }

}
