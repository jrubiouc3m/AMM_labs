#include <gst/gst.h>
#include <glib.h>



int main (int   argc,
      char *argv[])
{
  GMainLoop *loop;

  GstElement *pipeline, *source, *decoder, *conv, *sink;

  GstElement *mpegaudioparse, *mpg123audiodec, *audioconvert, *audioresample;

  /* Initialisation */
  gst_init (&argc, &argv);

  loop = g_main_loop_new (NULL, FALSE);


  /* Check input arguments */
  if (argc != 2) {
    g_printerr ("Usage: %s <Ogg/Vorbis filename>\n", argv[0]);
    return -1;
  }

// fuente, demultiplexor, decodificador, conversor, sumidero
  /* Create gstreamer elements */
  pipeline = gst_pipeline_new ("audio-player");
  source   = gst_element_factory_make ("filesrc",       "file-source");
  mpegaudioparse = gst_element_factory_make ("mpegaudioparse","mpegaudioparse");
  mpg123audiodec = gst_element_factory_make ("mpg123audiodec","mpg123audiodec");
  audioconvert = gst_element_factory_make ("audioconvert","audioconvert");
  audioresample = gst_element_factory_make ("audioresample","audioresample");
  sink     = gst_element_factory_make ("autoaudiosink", "audio-output");

  if (!pipeline || !source || !mpegaudioparse || !mpg123audiodec || !audioconvert || !audioresample || !sink) {
    g_printerr ("One element could not be created. Exiting.\n");
    return -1;
  }

  /* Set up the pipeline */

  /* we set the input filename to the source element */
  g_object_set (G_OBJECT (source), "location", argv[1], NULL);

  /* we add all elements into the pipeline */
  /* file-source | ogg-demuxer | vorbis-decoder | converter | alsa-output */
  gst_bin_add_many (GST_BIN (pipeline),
                    source, mpegaudioparse, mpg123audiodec,audioconvert ,audioresample , sink, NULL);

  /* we link the elements together */
  gst_element_link_many (source, mpegaudioparse, mpg123audiodec, audioconvert ,audioresample, sink, NULL);

  /* Set the pipeline to "playing" state*/
  g_print ("Now playing: %s\n", argv[1]);
  gst_element_set_state (pipeline, GST_STATE_PLAYING);


  /* Iterate */
  g_print ("Running...\n");
  g_main_loop_run (loop);


  /* Out of the main loop, clean up nicely */
  g_print ("Returned, stopping playback\n");
  gst_element_set_state (pipeline, GST_STATE_NULL);

  g_print ("Deleting pipeline\n");
  gst_object_unref (GST_OBJECT (pipeline));

  return 0;
}
