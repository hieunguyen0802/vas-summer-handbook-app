using AutoMapper;
using SummerHandbookApi.Models;

namespace VASSchoolBusAPI.Helper
{
    public class AutoMapperConfig : Profile
    {
        public AutoMapperConfig()
        {

            CreateMap<SummerHandbook,Parent>();
            CreateMap<SummerHandbook,Student>();
      
        }
    }
}