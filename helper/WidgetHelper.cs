using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;

namespace iNetVOD.MCE.Widget
{
	public class WidgetHelper : IObjectSafety
	{
		public void GetInterfaceSafetyOptions(ref Guid riid, out int supportedOptions, out int enabledOptions)
		{
			supportedOptions = 3;
			enabledOptions = 3;
		}

		public void SetInterfaceSafetyOptions(ref Guid riid, int optionSetMask, int enabledOptions)
		{
		}

		public void openMediaPlayer(string mediaFile)
		{
			Process proc = new System.Diagnostics.Process();
			proc.EnableRaisingEvents = false;
			//proc.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
			proc.StartInfo.FileName = "C:\\Program Files\\Windows Media Player\\wmplayer.exe";
			//proc.StartInfo.WorkingDirectory = work;
			proc.StartInfo.Arguments = "/prefetch:9 /Play \"" + mediaFile + "\"";
			proc.Start();
			//proc.WaitForExit();
		}
	}
}
