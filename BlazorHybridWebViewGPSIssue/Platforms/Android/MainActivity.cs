using Android;
using Android.App;
using Android.Content.PM;
using Android.OS;
using AndroidX.Core.App;
using AndroidX.Core.Content;
using Google.Android.Material.Snackbar;

namespace BlazorHybridWebViewGPSIssue.Platforms.Android;

[Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize)]
public class MainActivity : MauiAppCompatActivity
{
    protected override void OnCreate(Bundle savedInstanceState)
    {
        base.OnCreate(savedInstanceState);
        
        
        Microsoft.Maui.Essentials.Platform.Init(this, savedInstanceState);

   
        ////Add this Line does prompt the user, without this there is no prompt to the user to allow location access
        ActivityCompat.RequestPermissions(this, new[] {
            Manifest.Permission.Camera, Manifest.Permission.RecordAudio, Manifest.Permission.ModifyAudioSettings,
            Manifest.Permission.AccessCoarseLocation,Manifest.Permission.AccessFineLocation, Manifest.Permission.AccessNetworkState
        }, 0);
    }

    public override void OnRequestPermissionsResult(int requestCode, string[] permissions, Permission[] grantResults)
    {
        Microsoft.Maui.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);

       
        base.OnRequestPermissionsResult(requestCode, permissions, grantResults);

       

    }


}
