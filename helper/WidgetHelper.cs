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

		private static string[] fMediaPlayerExtList = { ".wmv", ".asf", ".avi", ".wma", ".mp3", ".wav" };
		private static string[] fQuickTimeExtList = { ".mov", ".mp4" };
		private static string[] fFlashExtList = { ".swf" };

		public bool openPlayer(string mediaFile)
		{
			string ext = Path.GetExtension(mediaFile);
			if((ext != null) && (ext.Length != 0))
			{
				if(isExtInList(fMediaPlayerExtList, ext))
					openMediaPlayer(mediaFile);
				else if(isExtInList(fQuickTimeExtList, ext))
					openQuickTime(mediaFile);
				else if(isExtInList(fFlashExtList, ext))
					openInternetExplorer(mediaFile);
				else
					return false;
			}
			else
				return false;

			return true;
		}

		private bool isExtInList(string[] mediaPlayerExtList, string ext)
		{
			foreach(string playerExt in mediaPlayerExtList)
				if(playerExt.Equals(ext))
					return true;
			return false;
		}

		private void openMediaPlayer(string mediaFile)
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
		public void openQuickTime(string mediaFile)
		{
			Process proc = new System.Diagnostics.Process();
			proc.EnableRaisingEvents = false;
			//proc.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
			proc.StartInfo.FileName = "C:\\Program Files\\QuickTime\\QuickTimePlayer.exe";
			//proc.StartInfo.WorkingDirectory = work;
			proc.StartInfo.Arguments = "\"" + mediaFile + "\"";
			proc.Start();
			//proc.WaitForExit();
		}

		public void openInternetExplorer(string mediaFile)
		{
			Process proc = new System.Diagnostics.Process();
			proc.EnableRaisingEvents = false;
			//proc.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;
			proc.StartInfo.FileName = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
			//proc.StartInfo.WorkingDirectory = work;
			proc.StartInfo.Arguments = mediaFile;
			proc.Start();
			//proc.WaitForExit();
		}
	}
}
