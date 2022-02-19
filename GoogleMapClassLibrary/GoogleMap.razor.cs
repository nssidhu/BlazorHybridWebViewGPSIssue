using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Configuration;
using Microsoft.JSInterop;
using Microsoft.JSInterop.Implementation;
using Microsoft.Maui.Essentials;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GoogleMapClassLibrary
{
    public partial class GoogleMap : IAsyncDisposable
    {
        [Inject]
        public IJSRuntime JSRuntime { get; set; }

      

        [Parameter]
        public EventCallback<MapLocation> LocationUpdatedEvent { get; set; }



        //This is used to encapsulate the Javascript file to this page only
        public IJSObjectReference ObjectReference { get; set; }


        //This need to passed down to Javascript so that Javascript can call bacl the .NEt Method usign this reference.
        DotNetObjectReference<GoogleMap> BlazorPageRef;

        [Parameter]
        public bool ShowMap { get; set; } = true;

        [Parameter]
        public string MapHeight { get; set; }

        [Parameter]
        public string Mapwidth { get; set; }

        string googleMapMessage = "";
        double Latitude;
        double Longitude;
        string erMessage = "";
        bool GetingLocation = false;

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
               

                if (string.IsNullOrEmpty(MapHeight))
                    MapHeight = "540px";
                if (string.IsNullOrEmpty(Mapwidth))
                    Mapwidth = "900px";

                BlazorPageRef = DotNetObjectReference.Create(this);

                ObjectReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/GoogleMapClassLibrary/GoogleMap.js");
                              
              
               var  googleAPI = "AIzaSyC8uZQso05nCFFrLMAMjNIqvJeykBZoaYM";

                await ObjectReference.InvokeVoidAsync("initGoogleMap", "GoogleMapDiv", BlazorPageRef, "GoogleMapErrorDiv", googleAPI);

                await GetLocation();
            }
        }

        [JSInvokable]
        public void GoogleMapJSCallBack(string message)
        {
            googleMapMessage = message;
            //StateHasChanged();
        }

        public async Task ShowCurrentPosition(double latitude, double longitude)
        {
            var pos = new position()
            {
                coords = new coords() { latitude = latitude.ToString(), longitude = longitude.ToString() }
            };

          
            await ObjectReference.InvokeVoidAsync("showPosition", pos);
        }
        public async Task RenderLocationOnMap(List<DTO_OrgLocation> Locations)
        {
            try
            {

                Console.WriteLine("RenderLocationOnMap Executed");
                await ObjectReference.InvokeVoidAsync("displayMarkersOnGoogleMap", Locations);
            }
            catch (Exception e)
            {

            }
        }

        [JSInvokable]
        public void LocationUpdated(double latitude, double longitude)
        {
            Console.WriteLine($"Blazor-GoogleMap, Location Update Recieved : Latitude: {latitude} and Longitude : {longitude}");
            Latitude = latitude;
            Longitude = longitude;
            StateHasChanged();
            var lc = new MapLocation();
            lc.Latitude = latitude;
            lc.Longitude = longitude;
            LocationUpdatedEvent.InvokeAsync(lc);

        }

        [JSInvokable("MapLocationError")]
        public void MapLocationError(string ErrorMessage)
        {
            googleMapMessage = ErrorMessage;
            Console.Error.WriteLine("Recieved Error Message from GoogleMap JavaScript SDK : " + ErrorMessage);
            StateHasChanged();
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

                    await ShowCurrentPosition(location.Latitude, location.Longitude);
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
                //AppInfo.ShowSettingsUI();
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
        public ValueTask DisposeAsync()
        {
            if(ObjectReference != null)
            {
                ObjectReference.InvokeVoidAsync("ClearVariables");
            }
           

            Console.WriteLine("GoogleMap blazor Page disposed");
            return ValueTask.CompletedTask;
        }

       
    }


    public class position
    {
        public coords coords { get; set; }
    }

    public class coords
    {
        public string latitude { get; set; }
        public string longitude { get; set; }
    }
}
