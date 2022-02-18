using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GoogleMapClassLibrary
{
    public partial class DTO_OrgLocation
    {
        public Guid? Org_LocationID_PK { get; set; }
        public Guid? OrgID_FK { get; set; }
        public string? LocationName { get; set; }
        public string? LocationCode { get; set; }
        public string? ContactPersonName { get; set; }
        public string? Cell { get; set; }
        public string? Email { get; set; }
        public string? Country { get; set; }
        public Guid? CountryID_FK { get; set; }
        public string State { get; set; }
        public Guid? StateID_FK { get; set; }
        public string? City { get; set; }
        public Guid? CityID_FK { get; set; }
        public string? Number { get; set; }
        public string? Street_Address { get; set; }
        public string? Address2 { get; set; }
        public string? PostalCode { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public DateTimeOffset? DateCreatedOn { get; set; }
        public DateTimeOffset? DateUpdatedOn { get; set; }
        public string? TimeZone_Blazor { get; set; }
        public string? TimeZone_SQL { get; set; }
        public string? Timezone_Region { get; set; }
        public string? LocationOpenCloseStatus { get; set; }
        public string? LocationMessage { get; set; }

        public DateTimeOffset? LocationStartTime { get; set; }
        public DateTimeOffset? LocationStopTime { get; set; }

        public bool? AllowSMStoUnverifiedCellNumber { get; set; }

        public string? LocationType { get; set; }

        public bool? IsActive { get; set; }

        public int NumberOfpeopleInLine { get; set; }

        public int RangeLimitInMeters { get; set; }
        public double DistanceInMiles { get; set; }
    }
}
