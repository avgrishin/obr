using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace obr.Controllers
{
  [Produces("application/json")]
  [Route("api/[controller]")]
  public class RepWAController : Controller
  {

    private static string[] Fund = new[] { "USD", "EUR" };
    private static string[] Sec = new[] { "GAZP", "GMKN", "SBER", "ROSN", "NLMK", "LKOH", "VTBR", "RTKM" };
    private static string[] Pifs = new[] { "PIF1", "ПИФ2" };

    [HttpGet("[action]/{id:int}")]
    public IEnumerable<dynamic> GetData(int id)
    {
      if (id == 1)
      {
        return Enumerable.Range(1, 2).Select(index => new Course
        {
          s = Fund[index - 1],
          c = 50 + index * 10,
          dt = DateTime.Today,
          y = .05 + index * .01
        });
      }
      else if (id == 2)
      {
        return Enumerable.Range(0, 7).Select(index => new Rate
        {
          sec = Sec[index],
          cc = 100,
          cl = "0.1",
          chg = 0.02,
          tm = "13:34"
        });
      }
      else if (id == 3)
      {
        return Enumerable.Range(0, 2).Select(index => new Pif
        {
          Name = Pifs[index],
          Date = DateTime.Today.ToShortDateString(),
          SCHA = "10000000",
          SCHAD = 0.02,
          PricePai = "13.34",
          PricePaiD = 0.3
        });
      }
      return null;
    }
    [HttpPost("[action]")]
    public IEnumerable<dynamic> PostPifers([FromBody]string q)
    {
      return Enumerable.Range(1, q.Length < 10 ? 13 - q.Length : 3).Select(index => new Pifers
      {
        id = index,
        brief = q + index.ToString(),
        fam = q + index.ToString(),
        im = "im" + index.ToString(),
        ot = "ot" + index.ToString()
      });
    }
    [HttpPost("[action]")]
    public IEnumerable<dynamic> PostPiferRest([FromBody]int id)
    {
      return Enumerable.Range(1, 3).Select(index => new PiferRest
      {
        id = index,
        name = "ПИФ" + index.ToString(),
        num = 10 + index,
        course = 20 * index,
        qty = (10 + index) * 20 * index
      });
    }
    [HttpPost("[action]")]
    public IEnumerable<dynamic> PostPiferOrders(PifOrdersParams param)
    {
      return Enumerable.Range(1, 3).Select(index => new PiferOrders
      {
        id = index,
        sid = index,
        name = "ПИФ" + index.ToString(),
        dd = DateTime.Today.AddDays(index),
        cd = DateTime.Today.AddDays(index + 3),
        num = 10 + index,
        qty = (10 + index) * 20 * index,
        ppz = "U00" + index.ToString(),
        dt = 1,
        instr = "ПИФ" + index.ToString(),
        node = "ОК"
      });
    }
    public class PifOrdersParams
    {
      public int? id { get; set; }
      public int? secId { get; set; }
    }
    public class PiferOrders
    {
      public int id { get; set; }
      public int sid { get; set; }
      public string name { get; set; }
      public DateTime? dd { get; set; }
      public DateTime? cd { get; set; }
      public decimal? num { get; set; }
      public decimal? qty { get; set; }
      public string ppz { get; set; }
      public byte? dt { get; set; }
      public string instr { get; set; }
      public string node { get; set; }
    }
    public class PiferRest
    {
      public int id { get; set; }
      public string name { get; set; }
      public decimal? num { get; set; }
      public double? course { get; set; }
      public decimal? qty { get; set; }
    }
    public class Pifers
    {
      public int id { get; set; }
      public string brief { get; set; }
      public string fam { get; set; }
      public string im { get; set; }
      public string ot { get; set; }
    }
    public class Course
    {
      public string s { get; set; }
      public double? c { get; set; }
      public DateTime dt { get; set; }
      public double? y { get; set; }
    }

    public class Rate
    {
      public string sec { get; set; }
      public double? cc { get; set; }
      public string cl { get; set; }
      public double chg { get; set; }
      public string tm { get; set; }
    }

    public class Pif
    {
      public string Name { get; set; }
      public string Date { get; set; }
      public string SCHA { get; set; }
      public double SCHAD { get; set; }
      public string PricePai { get; set; }
      public double PricePaiD { get; set; }
    }

  }
}