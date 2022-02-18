using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Microsoft.JSInterop.Implementation;
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

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                if (string.IsNullOrEmpty(MapHeight))
                    MapHeight = "540px";
                if (string.IsNullOrEmpty(Mapwidth))
                    Mapwidth = "900px";

                BlazorPageRef = DotNetObjectReference.Create(this);

                //ObjectReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "/js/app.js");
                //ObjectReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "/js/GoogleMap.js");
                //ObjectReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/GetinLineClassLib/exampleJsInterop.js");
                ObjectReference = await JSRuntime.InvokeAsync<IJSObjectReference>("import", "./_content/GoogleMapClassLibrary/GoogleMap.js");
                // await JsObjectReference.InvokeVoidAsync("loadScript", "https://maps.googleapis.com/maps/api/js?key=AIzaSyC8uZQso05nCFFrLMAMjNIqvJeykBZoaYM&libraries=geometry");

                await ObjectReference.InvokeVoidAsync("initGoogleMap", "GoogleMapDiv", BlazorPageRef, "GoogleMapErrorDiv");
            }
        }

        [JSInvokable]
        public void GoogleMapJSCallBack(string message)
        {
            googleMapMessage = message;
            //StateHasChanged();
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
        public ValueTask DisposeAsync()
        {
            ObjectReference.InvokeVoidAsync("ClearVariables");

            Console.WriteLine("GoogleMap blazor Page disposed");
            return ValueTask.CompletedTask;
        }

       
    }
}
