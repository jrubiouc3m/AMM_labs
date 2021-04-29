#include <gst/gst.h>

/* Structure to contain all our information, so we can pass it to callbacks */
typedef struct _CustomData {
  GstElement *pipeline;
  GstElement *fakesrc;
  GstElement *fakesink;
} CustomData;
CustomData data;

/* Handler for the pad-added signal */
static gboolean bus_call (GstBus *bus,GstMessage *msg, gpointer data1);


int main(int argc, char *argv[]) {

  GstBus *bus;
  GstStateChangeReturn ret;


  GMainLoop *loop;

  /* Initialize GStreamer */
  gst_init (&argc, &argv);

  g_print ("Inicio programa.\n");

  /* Create the elements */


  data.fakesrc = gst_element_factory_make ("fakesrc", "source");
  data.fakesink = gst_element_factory_make ("fakesink", "sink"); 

  loop = g_main_loop_new (NULL, FALSE);

  /* Create the empty pipeline */
  data.pipeline = gst_pipeline_new ("test-pipeline");

  if (!data.pipeline || !data.fakesrc || !data.fakesink ) {
    g_printerr ("Not all elements could be created.\n");
    return -1;
  }
  g_print ("Crea elementos.\n");

  /* Build the pipeline. Note that we are NOT linking the source at this
   * point. We will do it later. */
  gst_bin_add_many (GST_BIN (data.pipeline), data.fakesrc, data.fakesink, NULL);
  if (!gst_element_link_many (data.fakesrc, data.fakesink, NULL)) {
    g_printerr ("Elements could not be linked.\n");
    gst_object_unref (data.pipeline);
    return -1;
  }
  g_print ("add elementos.\n");

  /* Start playing */
  ret = gst_element_set_state (data.pipeline, GST_STATE_PLAYING);
  if (ret == GST_STATE_CHANGE_FAILURE) {
    g_printerr ("Unable to set the pipeline to the playing state.\n");
    gst_object_unref (data.pipeline);
    return -1;
  }
  g_print ("playing.\n");

  /* Listen to the bus */
  bus = gst_element_get_bus (data.pipeline);
  g_print ("creo el bus.\n");
 /* Bus message handling */
 //  GstBus *bus = gst_pipeline_get_bus (GST_PIPELINE (pipeline));
  gst_bus_add_watch (bus, bus_call, loop);
  g_print ("bus_call.\n");
  gst_object_unref (bus);
  g_print ("Run...\n");
  g_main_loop_run (loop);
  /* Free resources */
  gst_object_unref (bus);
  gst_element_set_state (data.pipeline, GST_STATE_NULL);
  gst_object_unref (data.pipeline);
  return 0;
}



/* --------------------------------------------------------------------- *
 *  Bus message handler
 * --------------------------------------------------------------------- */
static gboolean bus_call (GstBus     *bus,
          GstMessage *msg,
          gpointer    data1)
{
    GMainLoop *loop = (GMainLoop *) data1;
    char *src = GST_MESSAGE_SRC_NAME(msg);
  GError *err;
      gchar *debug_info;

      switch (GST_MESSAGE_TYPE (msg)) {
        case GST_MESSAGE_ERROR:
          gst_message_parse_error (msg, &err, &debug_info);
          g_printerr ("Error received from element %s: %s\n", GST_OBJECT_NAME (msg->src), err->message);
          g_printerr ("Debugging information: %s\n", debug_info ? debug_info : "none");
          g_clear_error (&err);
          g_free (debug_info);
          g_main_loop_quit (loop);
          break;
        case GST_MESSAGE_EOS:
          g_print ("End-Of-Stream reached.\n");
          g_main_loop_quit (loop);
          break;
        case GST_MESSAGE_STATE_CHANGED:
          /* We are only interested in state-changed messages from the pipeline */
          if (GST_MESSAGE_SRC (msg) == GST_OBJECT (data.pipeline)) {
            GstState old_state, new_state, pending_state;
            gst_message_parse_state_changed (msg, &old_state, &new_state, &pending_state);
            g_print ("Pipeline state changed from %s to %s:\n",
                gst_element_state_get_name (old_state), gst_element_state_get_name (new_state));
          }
          break;
        default:
          /* We should not reach here */
            g_print ("..[bus].. %15s :: %-15s\n", src, GST_MESSAGE_TYPE_NAME(msg));
      //    g_printerr ("Unexpected message received.\n");
          break;
      }
    //  gst_message_unref (msg);
      return TRUE;

  }
